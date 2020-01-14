<template>
    <GmapMap
        :center="centerMap"
        :zoom="15"
        map-type-id="roadmap"
        :style="{width: width, height: height}"
    >
        <GmapMarker :position="centerMap" />
    </GmapMap>
</template>

<script>
export default {
    name: "restaurantMap",
    props:["centerMap", "height", "width"]
}
</script>