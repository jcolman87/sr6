export default interface IHasPostCreate<DocumentType extends foundry.abstract.Document> {
	onPostCreate?(document: DocumentType, controlled: boolean): Promise<void>;
}
