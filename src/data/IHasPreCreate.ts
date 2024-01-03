/**
 *
 * @author jaynus
 * @file Utility interface to mark Document DataModel instances that have custom preCreate callbacks.
 */

export default interface IHasPreCreate<DocumentType extends foundry.abstract.Document> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	preCreate?(document: DocumentType, data: PreDocumentId<any>, options: DocumentModificationContext<DocumentType>, user: foundry.documents.BaseUser): Promise<void>;
}
