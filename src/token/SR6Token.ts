export class SR6TokenDocument extends TokenDocument {}

export class SR6Token<TDocument extends TokenDocument = SR6TokenDocument> extends Token<TDocument> {
	constructor(document: TDocument) {
		log.debug(document);
		super(document);
	}
}
