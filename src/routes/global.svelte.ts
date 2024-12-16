import { Group, Mesh } from "three";
interface GlobalStateTypes {
	addingJoint: boolean;
	selectedGroup: Group | undefined;
	modifyingObjectIndex: number | undefined;
	rootGroupIndex: number;
	transformType: string;
}
export const globalStates = $state<GlobalStateTypes>({
	addingJoint: false,
	selectedGroup: undefined,
	modifyingObjectIndex: 0,
	rootGroupIndex: 0,
	transformType: "transform"
});
