export default interface IHasPostCreate {
	onPostCreate?(): Promise<void>;
}
