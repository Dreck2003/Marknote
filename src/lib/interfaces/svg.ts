export interface SvgProps {
	fill?: string;
	width?: string | number;
	height?: string | number;
	stroke?: string;
	"stroke-width"?: string | number;
	class?: string;
	viewBox?: string;
}

export const SvgDefaultProps = (): SvgProps => ({
	fill: "black",
	height: 24,
	width: 24,
	stroke: "black",
	"stroke-width": 1,
	viewBox: "0 0 24 24",
});

/*   Chevron or Arrow  */
export type PositionArrow = "left" | "right" | "top" | "down";

export const getRotate = (pos: PositionArrow): string => {
	switch (pos) {
		case "left":
			return "90deg";
		case "right":
			return "-90deg";
		case "top":
			return "180deg";
	}

	return `0deg`;
};
