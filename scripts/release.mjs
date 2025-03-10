import chalk from "chalk";
import { execa } from "execa";
import semver from "semver";
import { writeFile } from "fs/promises";
import { readFileSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import minimist from "minimist";
import prompts from "prompts"

const rootPath = path.join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = path.join(rootPath, "package.json");

const EXPECT_BRANCH = "master";
const PKG_NAME = "unplugin-fs-router";
const pkg = JSON.parse(readFileSync(pkgPath));

const args = minimist(process.argv.slice(2));
const { tag: optionTag, dry: isDryRun, noPublish } = args;

if (args.h || args.help) {
	console.log(
		`
  Usage: node release.mjs [flags]
         node release.mjs [ -h | --help ]
  
  Flags:
    --tag               Publish under a given npm dist tag
    --dry               Dry run
	--noPublish         Skip publishing packages
  `.trim()
	);
	process.exit(0);
}

const step = (...msg) => console.log(chalk.cyan(...msg));

async function main() {
	try {
		step("check git status...");
		await gitCleanCheck();

		step("compute release version...");
		const lastVersion = await getLatestVersion();
		const newVersion = await getNewVersion(lastVersion);
		
		const { yes: isReleaseConfirmed } = await prompts({
			type: "confirm",
			name: "yes",
			message: `Releasing ${newVersion}`,
		});

		if (!isReleaseConfirmed) {
			return;
		}

		step("update new version to package.json...");
		await updateNewVersion(newVersion);

		step("git tag and git push...");
		await gitTag(newVersion);

		step("login npm...");
		await loginNPM();

		step("publish...");
		await publish(newVersion);
	} catch (error) {
		console.log(chalk.red(error.message))
	}
}

async function getLatestVersion() {
	try {
		const { stdout } = await execa`npm show ${PKG_NAME} version`;
		const lastVersion = semver.clean(stdout.trim());
		return lastVersion;
	} catch (error) {
		throw new Error(`❌ can't get version: ${error.message}`);
	}
}

async function getNewVersion(lastVersion) {
	let version = lastVersion;
	try {
		const prerelease = semver.prerelease(lastVersion);
		const preId = prerelease && prerelease[0];
		const versionIncrements = [
			"patch",
			"minor",
			"major",
			...(preId ? ["prepatch", "preminor", "premajor", "prerelease"] : []),
		];
		const betaVersion = semver.inc(lastVersion, "prerelease", "beta");
		const { release } = await prompts({
			type: "select",
			name: "release",
			message: `Which type you want to release`,
			choices: versionIncrements
				.map((release) => {
					const newVersion = semver.inc(version, release, preId);
					return {
						value: newVersion,
						title: `${release}: ${newVersion}`,
					};
				})
				.concat(
					optionTag === "beta"
						? [
								{
									title: `beta: ${betaVersion}`,
									value: betaVersion,
								},
						  ]
						: []
				)
				.concat([{ value: "custom", title: "custom" }]),
		});

		if (release === "custom") {
			version = (
				await prompts({
					type: "text",
					name: "version",
					message: `Input custom version`,
					initial: version,
				})
			).version;
		} else {
			version = release;
		}

		if (!semver.valid(version)) {
			throw new Error(`invalid target version: ${version}`);
		}
	} catch (error) {
        throw new Error(error)
    }

	return version;
}

async function updateNewVersion(newVersion) {
	pkg.version = newVersion;
	await writeFile(pkgPath, JSON.stringify(pkg, null, 2), "utf-8");
	chalk.green(`✅ package.json's version already set to ${newVersion}`);
}

async function gitCleanCheck() {
	// check if git is clean
	const isClean = !!(await execa({ stdio: "pipe" })`git status --porcelain`)
		.stdout;

	if (!isClean) {
		chalk.red("Git repo isn't clean.");
		return;
	}
	// check is correct branch
	const currentBranch = !!(
		await execa({ stdio: "pipe" })`git branch --show-current`
	).stdout;

	if (currentBranch !== EXPECT_BRANCH) {
		chalk.red(`You are not on expected ${EXPECT_BRANCH} branch`);
		return;
	}
	// check is sync remote
	const isOutdatedRE = new RegExp(
		`\\W${EXPECT_BRANCH}\\W.*(?:fast-forwardable|local out of date)`,
		"i"
	);

	const gitOutdateed = (await execa({ stdio: "pipe" })`git remote show origin`)
		.stdout;

	if (isOutdatedRE.test(gitOutdateed)) {
		chalk.red(`Git branch is not in sync with remote`);
		return;
	}
}

async function gitTag(newVersion) {
	if (isDryRun || !noPublish) {
		await execa({ stdio: "inherit" })`git add .`;
		await execa({
			stdio: "inherit",
		})`git commit -m 'release:\s${newVersion}'`;
		await execa({ stdio: "inherit" })`git tag v${newVersion}`;
		await execa({ stdio: "inherit" })`git push`;
		await execa({ stdio: "inherit" })`git push origin v${newVersion}`
		return
	}
	chalk.blue("Skipping publishing...")
}

async function loginNPM() {
	try {
		const { stdout } = await execa({ stdout: "pipe" })`npm whoami`;
		return stdout.trim();
	} catch (error) {
		chalk.red(`❌ you are not login npm`);
		const { username, password, email } = await prompts([
			{
				type: "text",
				name: "username",
				message: "npm user name",
			},
			{
				type: "text",
				name: "password",
				message: "npm user password",
			},
			{
				type: "text",
				name: "email",
				message: "npm user email",
			},
		]);
		await execa({
			stdout: "inherit",
		})`echo "${username}\n${password}\n${email}\n" | npm login`;
		return username;
	}
}

async function publish(newVersion) {
	try {
		await execa({ stdio: "pipe" })`pnpm publish ${
			isDryRun ? "--dry-run" : ""
		} ${
			optionTag ? "--tag " + optionTag : ""
		}} --access public --publish-branch ${EXPECT_BRANCH}`;
		chalk.green(`✅ Successfully published ${PKG_NAME}@${newVersion}`);
	} catch (error) {
		throw error;
	}
}

main().catch((error) => {
	chalk.red(error);
	process.exit(1);
});
