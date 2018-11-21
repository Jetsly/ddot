import * as https from 'https';
import * as webpack from 'webpack';

export = Config;

declare namespace __Config {
  class Chained<Parent> {
    public end(): Parent;
  }

  class TypedChainedMap<Parent, Value> extends Chained<Parent> {
    public clear(): this;
    public delete(key: string): this;
    public has(key: string): boolean;
    public get(key: string): Value;
    public set(key: string, value: Value): this;
    public merge(obj: { [key: string]: Value }): this;
    public entries(): { [key: string]: Value };
    public values(): Value[];
    public when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void
    ): this;
  }

  class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}

  class TypedChainedSet<Parent, Value> extends Chained<Parent> {
    public add(value: Value): this;
    public prepend(value: Value): this;
    public clear(): this;
    public delete(key: string): this;
    public has(key: string): boolean;
    public merge(arr: Value[]): this;
    public values(): Value[];
    public when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void
    ): this;
  }

  class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
}

declare class Config extends __Config.ChainedMap<void> {
  public devServer: Config.DevServer;
  public entryPoints: Config.TypedChainedMap<Config, Config.EntryPoint>;
  public module: Config.Module;
  public node: Config.ChainedMap<this>;
  public output: Config.Output;
  public optimization: Config.Optimization;
  public performance: Config.Performance;
  public plugins: Config.Plugins<this>;
  public resolve: Config.Resolve;
  public resolveLoader: Config.ResolveLoader;

  public amd(value: { [moduleName: string]: boolean }): this;
  public bail(value: boolean): this;
  public cache(value: boolean | any): this;
  public devtool(value: Config.DevTool): this;
  public context(value: string): this;
  public externals(value: webpack.ExternalsElement | webpack.ExternalsElement[]): this;
  public loader(value: any): this;
  public mode(value: 'development' | 'production'): this;
  public parallelism(value: number): this;
  public profile(value: boolean): this;
  public recordsPath(value: string): this;
  public recordsInputPath(value: string): this;
  public recordsOutputPath(value: string): this;
  public stats(value: webpack.Options.Stats): this;
  public target(value: string): this;
  public watch(value: boolean): this;
  public watchOptions(value: webpack.Options.WatchOptions): this;

  public entry(name: string): Config.EntryPoint;
  public plugin(name: string): Config.Plugin<this>;

  public toConfig(object?: any): webpack.Configuration;
}

declare namespace Config {
  class Chained<Parent> extends __Config.Chained<Parent> {}
  class TypedChainedMap<Parent, Value> extends __Config.TypedChainedMap<
    Parent,
    Value
  > {}
  class ChainedMap<Parent> extends __Config.TypedChainedMap<Parent, any> {}
  class TypedChainedSet<Parent, Value> extends __Config.TypedChainedSet<
    Parent,
    Value
  > {}
  class ChainedSet<Parent> extends __Config.TypedChainedSet<Parent, any> {}

  class Plugins<Parent> extends TypedChainedMap<Parent, Plugin<Parent>> {}

  class Plugin<Parent> extends ChainedMap<Parent> implements Orderable {
    public init(value: (plugin: PluginClass, args: any[]) => webpack.Plugin): this;
    public use(plugin: PluginClass, args?: any[]): this;
    public tap(f: (args: any[]) => any[]): this;

    // Orderable
    public before(name: string): this;
    public after(name: string): this;
  }

  class Module extends ChainedMap<Config> {
    public rules: TypedChainedMap<this, Rule>;
    public rule(name: string): Rule;
    public noParse(
      noParse: RegExp | RegExp[] | ((contentPath: string) => boolean)
    ): this;
  }

  class Output extends ChainedMap<Config> {
    public chunkFilename(value: string): this;
    public crossOriginLoading(value: boolean | string): this;
    public filename(value: string): this;
    public library(value: string): this;
    public libraryTarget(value: string): this;
    public devtoolFallbackModuleFilenameTemplate(value: any): this;
    public devtoolLineToLine(value: any): this;
    public devtoolModuleFilenameTemplate(value: any): this;
    public hashFunction(value: string): this;
    public hashDigest(value: string): this;
    public hashDigestLength(value: number): this;
    public hashSalt(value: any): this;
    public hotUpdateChunkFilename(value: string): this;
    public hotUpdateFunction(value: any): this;
    public hotUpdateMainFilename(value: string): this;
    public jsonpFunction(value: string): this;
    public path(value: string): this;
    public pathinfo(value: boolean): this;
    public publicPath(value: string): this;
    public sourceMapFilename(value: string): this;
    public sourcePrefix(value: string): this;
    public strictModuleExceptionHandling(value: boolean): this;
    public umdNamedDefine(value: boolean): this;
  }

  class DevServer extends ChainedMap<Config> {
    public clientLogLevel(value: 'none' | 'error' | 'warning' | 'info'): this;
    public compress(value: boolean): this;
    public contentBase(value: boolean | string | string[]): this;
    public filename(value: string): this;
    public headers(value: { [header: string]: string }): this;
    public historyApiFallback(value: boolean | any): this;
    public host(value: string): this;
    public hot(value: boolean): this;
    public hotOnly(value: boolean): this;
    public https(value: boolean | https.ServerOptions): this;
    public inline(value: boolean): this;
    public lazy(value: boolean): this;
    public noInfo(value: boolean): this;
    public overlay(value: boolean | { warnings?: boolean; errors?: boolean }): this;
    public port(value: number): this;
    public progress(value: boolean): this;
    public proxy(value: any): this;
    public public(value: string): this;
    public publicPath(publicPath: string): this;
    public quiet(value: boolean): this;
    public setup(value: (expressApp: any) => void): this;
    public staticOptions(value: any): this;
    public stats(value: webpack.Options.Stats): this;
    public watchContentBase(value: boolean): this;
    public watchOptions(value: any): this;
  }

  class Performance extends ChainedMap<Config> {
    public hints(value: boolean | 'error' | 'warning'): this;
    public maxEntrypointSize(value: number): this;
    public maxAssetSize(value: number): this;
    public assetFilter(value: (assetFilename: string) => boolean): this;
  }

  class EntryPoint extends TypedChainedSet<Config, string> {}

  class Resolve extends ChainedMap<Config> {
    public alias: TypedChainedMap<this, string>;
    public aliasFields: TypedChainedSet<this, string>;
    public descriptionFiles: TypedChainedSet<this, string>;
    public extensions: TypedChainedSet<this, string>;
    public mainFields: TypedChainedSet<this, string>;
    public mainFiles: TypedChainedSet<this, string>;
    public modules: TypedChainedSet<this, string>;
    public plugins: TypedChainedMap<this, Plugin<this>>;

    public enforceExtension(value: boolean): this;
    public enforceModuleExtension(value: boolean): this;
    public unsafeCache(value: boolean | RegExp | RegExp[]): this;
    public symlinks(value: boolean): this;
    public cachePredicate(
      value: (data: { path: string; request: string }) => boolean
    ): this;

    public plugin(name: string): Plugin<this>;
  }

  class ResolveLoader extends ChainedMap<Config> {
    public extensions: TypedChainedSet<this, string>;
    public modules: TypedChainedSet<this, string>;
    public moduleExtensions: TypedChainedSet<this, string>;
    public packageMains: TypedChainedSet<this, string>;
  }

  class Rule extends ChainedMap<Module> {
    public uses: TypedChainedMap<this, Use>;
    public include: TypedChainedSet<this, webpack.Condition>;
    public exclude: TypedChainedSet<this, webpack.Condition>;

    public parser(value: { [optName: string]: any }): this;
    public test(value: webpack.Condition | webpack.Condition[]): this;
    public enforce(value: 'pre' | 'post'): this;

    public use(name: string): Use;
    public pre(): this;
    public post(): this;
  }

  class Optimization extends ChainedMap<Config> {
    public concatenateModules(value: boolean): this;
    public flagIncludedChunks(value: boolean): this;
    public mergeDuplicateChunks(value: boolean): this;
    public minimize(value: boolean): this;
    public minimizer(name: string): Config.Plugin<this>;
    public namedChunks(value: boolean): this;
    public namedModules(value: boolean): this;
    public nodeEnv(value: boolean | string): this;
    public noEmitOnErrors(value: boolean): this;
    public occurrenceOrder(value: boolean): this;
    public portableRecords(value: boolean): this;
    public providedExports(value: boolean): this;
    public removeAvailableModules(value: boolean): this;
    public removeEmptyChunks(value: boolean): this;
    public runtimeChunk(value: boolean | 'single' | 'multiple' | RuntimeChunk): this;
    public sideEffects(value: boolean): this;
    public splitChunks(value: SplitChunksOptions): this;
    public usedExports(value: boolean): this;
  }

  interface RuntimeChunk {
    name: string | RuntimeChunkFunction;
  }

  type RuntimeChunkFunction = (entryPoint: EntryPoint) => string;

  interface SplitChunksOptions {
    [name: string]: any;
  }

  interface LoaderOptions {
    [name: string]: any;
  }

  class Use extends ChainedMap<Rule> implements Orderable {
    public loader(value: string): this;
    public options(value: LoaderOptions): this;

    public tap(f: (options: LoaderOptions) => LoaderOptions): this;

    // Orderable
    public before(name: string): this;
    public after(name: string): this;
  }

  type DevTool =
    | 'eval'
    | 'inline-source-map'
    | 'cheap-eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-eval-source-map'
    | 'cheap-module-source-map'
    | 'eval-source-map'
    | 'source-map'
    | 'nosources-source-map'
    | 'hidden-source-map'
    | 'nosources-source-map'
    | '@eval'
    | '@inline-source-map'
    | '@cheap-eval-source-map'
    | '@cheap-source-map'
    | '@cheap-module-eval-source-map'
    | '@cheap-module-source-map'
    | '@eval-source-map'
    | '@source-map'
    | '@nosources-source-map'
    | '@hidden-source-map'
    | '@nosources-source-map'
    | '#eval'
    | '#inline-source-map'
    | '#cheap-eval-source-map'
    | '#cheap-source-map'
    | '#cheap-module-eval-source-map'
    | '#cheap-module-source-map'
    | '#eval-source-map'
    | '#source-map'
    | '#nosources-source-map'
    | '#hidden-source-map'
    | '#nosources-source-map'
    | '#@eval'
    | '#@inline-source-map'
    | '#@cheap-eval-source-map'
    | '#@cheap-source-map'
    | '#@cheap-module-eval-source-map'
    | '#@cheap-module-source-map'
    | '#@eval-source-map'
    | '#@source-map'
    | '#@nosources-source-map'
    | '#@hidden-source-map'
    | '#@nosources-source-map'
    | boolean;

  interface PluginClass {
    new (...opts: any[]): webpack.Plugin;
  }

  interface Orderable {
    before(name: string): this;
    after(name: string): this;
  }
}
