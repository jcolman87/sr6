import { GearAvailability, GearSize } from '@/item/data/gear/GearDataModel';

export function GearAvailabilityToString(avail: GearAvailability): string {
	const rating = avail.rating.toString();
	const legal = avail.illegal ? '(I)' : '';
	const license = avail.license ? '(L)' : '';

	return `${rating} ${legal} ${license}`.trim().replace('  ', ' ');
}

export function GearSizeToString(size: GearSize): string {
	return GearSize[size];
}

export function register(): void {
	Handlebars.registerHelper('GearAvailabilityToString', function (avail: GearAvailability) {
		return GearAvailabilityToString(avail);
	});
	Handlebars.registerHelper('GearSizeToString', function (avail: GearSize) {
		return GearSizeToString(avail);
	});
}
