import { Bite } from '../ability/index.js';
import { Party } from '../enum/index.js';
import { Werewolf as _Werewolf } from '../gang/index.js';
import Role from './Role.js';

export default class Werewolf extends Role {
	constructor(options) {
		super({
			...options,
			...{
				gang: _Werewolf
			}
		});
	}

	async voteBite() {
		if(this.died) return []
		if(this.Sick) {
			this.Sick = false
			await this.sendMessage('Bạn đang còn bị nhiễm bệnh nên đêm nay không thể cắn!');
			return []
		}
		return [await this.request(Bite)];
	}

	isWin() {
		const werewolfCount = this.world.items.filter(
			player => !player.died && player.party == Party.WEREWOLF
		).length;
		const villagerCount = this.world.items.filter(
			player => !player.died && player.party == Party.VILLAGER
		).length;
		return werewolfCount >= villagerCount;
	}
};
