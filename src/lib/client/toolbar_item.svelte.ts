import { type ControlButtonProps } from "@xyflow/svelte";
import type { Snippet } from "svelte";


export class ToolbarItem {
	item: Snippet<[ControlButtonProps]> = $state();
	props: ControlButtonProps | any = $state();
	condition?: ()=>boolean;
	update?: (changes: Partial<ToolbarItem>)=>void;

	constructor(item: Snippet<[ControlButtonProps]>, props: ControlButtonProps | any, condition?: ()=>boolean) {
		this.item = item;
		this.props = props;
		this.condition = condition;
	}
}

export class DragControl extends ToolbarItem {
	constructor(item: Snippet<[ControlButtonProps]>, props: ControlButtonProps | any, condition?: ()=>boolean) {
		super(item, props, condition);
		this.update = ({props})=>{
			this.props = {...this.props, ...props};
		}
	}
}
