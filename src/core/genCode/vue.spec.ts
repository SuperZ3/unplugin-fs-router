import path from "path";
import { describe, expect, it } from "vitest";
import Context from "../context";
import { DefaultOptions } from "../options";
import { DefaultVueExtensions } from "../../constants";


describe("react routes", () => {
	it("match snapshot", async () => {
		const options = {
			...DefaultOptions,
			rootPaths: ["/examples/vue/src/pages"],
			extensions: DefaultVueExtensions,
		};
		const ctx = new Context(options);
		await ctx.start();
		expect(ctx.genRoutes()).toMatchSnapshot();
	});
});
