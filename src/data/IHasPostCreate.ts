export default interface IHasPostCreate<DocumentType extends foundry.abstract.Document> {
	onPostCreate?(): Promise<void>;
}
