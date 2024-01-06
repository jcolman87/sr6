export default interface IHasOnUpdate<TDocumentType extends foundry.abstract.Document> {
	onUpdate?(
		changed: DeepPartial<TDocumentType['_source']>,
		options: DocumentUpdateContext<TDocumentType>,
		userId: string
	): Promise<void>;
}
