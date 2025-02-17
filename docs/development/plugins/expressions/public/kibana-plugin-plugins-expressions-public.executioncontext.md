<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-plugins-expressions-public](./kibana-plugin-plugins-expressions-public.md) &gt; [ExecutionContext](./kibana-plugin-plugins-expressions-public.executioncontext.md)

## ExecutionContext interface

`ExecutionContext` is an object available to all functions during a single execution; it provides various methods to perform side-effects.

<b>Signature:</b>

```typescript
export interface ExecutionContext<InspectorAdapters extends Adapters = Adapters, ExecutionContextSearch extends SerializableRecord = SerializableRecord> 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [abortSignal](./kibana-plugin-plugins-expressions-public.executioncontext.abortsignal.md) | <code>AbortSignal</code> | Adds ability to abort current execution. |
|  [getExecutionContext](./kibana-plugin-plugins-expressions-public.executioncontext.getexecutioncontext.md) | <code>() =&gt; KibanaExecutionContext &#124; undefined</code> | Contains the meta-data about the source of the expression. |
|  [getKibanaRequest](./kibana-plugin-plugins-expressions-public.executioncontext.getkibanarequest.md) | <code>() =&gt; KibanaRequest</code> | Getter to retrieve the <code>KibanaRequest</code> object inside an expression function. Useful for functions which are running on the server and need to perform operations that are scoped to a specific user. |
|  [getSearchContext](./kibana-plugin-plugins-expressions-public.executioncontext.getsearchcontext.md) | <code>() =&gt; ExecutionContextSearch</code> | Get search context of the expression. |
|  [getSearchSessionId](./kibana-plugin-plugins-expressions-public.executioncontext.getsearchsessionid.md) | <code>() =&gt; string &#124; undefined</code> | Search context in which expression should operate. |
|  [inspectorAdapters](./kibana-plugin-plugins-expressions-public.executioncontext.inspectoradapters.md) | <code>InspectorAdapters</code> | Adapters for <code>inspector</code> plugin. |
|  [isSyncColorsEnabled](./kibana-plugin-plugins-expressions-public.executioncontext.issynccolorsenabled.md) | <code>() =&gt; boolean</code> | Returns the state (true\|false) of the sync colors across panels switch. |
|  [types](./kibana-plugin-plugins-expressions-public.executioncontext.types.md) | <code>Record&lt;string, ExpressionType&gt;</code> | A map of available expression types. |
|  [variables](./kibana-plugin-plugins-expressions-public.executioncontext.variables.md) | <code>Record&lt;string, unknown&gt;</code> | Context variables that can be consumed using <code>var</code> and <code>var_set</code> functions. |

