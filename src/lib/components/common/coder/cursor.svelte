<div class="tracker" style={$$props.style}>
	<div class="cursor" />
</div>

<style>
	.tracker {
		position: absolute;
		width: auto;
		height: 20px;
		max-height: 20px;
	}

	.cursor {
		animation: cursor-frame 1000ms ease infinite;
		background-color: #1f281f;
		margin: 1px 0px;
		max-height: 20px;
		height: 20px;
		width: 1px;
	}
	@keyframes cursor-frame {
		0% {
			opacity: 1;
		}
		60% {
			opacity: 0;
		}
	}
</style>
