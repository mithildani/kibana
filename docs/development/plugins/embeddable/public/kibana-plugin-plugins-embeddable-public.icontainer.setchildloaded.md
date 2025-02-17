<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [kibana-plugin-plugins-embeddable-public](./kibana-plugin-plugins-embeddable-public.md) &gt; [IContainer](./kibana-plugin-plugins-embeddable-public.icontainer.md) &gt; [setChildLoaded](./kibana-plugin-plugins-embeddable-public.icontainer.setchildloaded.md)

## IContainer.setChildLoaded() method

Embeddables which have deferEmbeddableLoad set to true need to manually call setChildLoaded on their parent container to communicate when they have finished loading.

<b>Signature:</b>

```typescript
setChildLoaded<E extends IEmbeddable = IEmbeddable>(embeddable: E): void;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  embeddable | <code>E</code> | the embeddable to set |

<b>Returns:</b>

`void`

