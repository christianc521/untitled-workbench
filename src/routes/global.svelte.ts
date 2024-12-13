import { Group } from "three";
interface GlobalStateTypes {
	addingJoint: boolean;
	selectedGroup: Group | undefined;
}
export const globalStates = $state<GlobalStateTypes>({
	addingJoint: false,
	selectedGroup: undefined
});
