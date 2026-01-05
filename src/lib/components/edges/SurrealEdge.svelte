<script lang="ts">
import { BaseEdge, getStraightPath, type EdgeProps } from "@xyflow/svelte";

let { id, data, sourceX, sourceY, targetX, targetY, ...rest } = {} as EdgeProps;

let [path, labelX, labelY] = $derived(
    getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    })
  );
</script>

<div class="surreal-edge">
    <BaseEdge {id} {path} {labelX} {labelY} {...rest} />
</div>
