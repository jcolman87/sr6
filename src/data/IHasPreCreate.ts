/**
 *
 * @author jaynus
 * @file Utility interface to mark Document DataModel instances that have custom preCreate callbacks.
 */

export default interface IHasPreCreate<TDocumentType extends foundry.abstract.Document> {
	preCreate?(
		document: TDocumentType,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: PreDocumentId<any>,
		options: DocumentModificationContext<TDocumentType>,
		user: foundry.documents.BaseUser
	): Promise<void>;
}
