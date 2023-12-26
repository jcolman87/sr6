<script lang="ts" setup>

</script>

<template>
	<div class="character-sheet">

	</div>
</template>

<style lang="scss" scoped>
.character-sheet {
	width: 100%;
	height: 100%;

	display: grid;
	// Meta, Combat Stats, Tabs, tab content
	grid-template-rows: repeat(3, auto) 1fr;
	gap: 0.5em;
}

// Container for the character's secondary combat stats (wounds, strain, etc.)
.combat-stat-row {
	// By default, evenly space the items across the full sheet width.
	display: flex;
	gap: 1em;
	align-items: center;
	justify-content: space-around;

	// When the sheet is wider than 700px, simply center the stat boxes.
	@container sheet (min-width: 700px) {
		display: flex;
		justify-content: center;

		.combat-stat {
			width: 165px;
		}
	}
}
</style>
