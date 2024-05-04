import { Party } from '../enum/index.js';
import { validIndex, notSelf } from '../format/index.js';
import Ability from './Ability.js';

export default class Seer extends Ability {
	static question(player) {
		return (
			'• Bạn muốn soi ai trong danh sách:\n' + player.world.game.listPlayer()
		);
	}

	static check(player, value) {
		const index = player.format(value, validIndex, notSelf);
		player.sendMessage(
			`• Bạn đã chọn xem phe của người chơi ${player.world.items[index].name}!`
		);
		return index;
	}

	static async nightend(player, index) {
	    if (index == null) return;

	    var target = player.world.items[index];
	    var party = target.party;
	    if (target.constructor.name == 'Lycan') party = 4;
	    if (target.constructor.name == 'Minion') party = 2;
	    for (let partyName in Party) {
	        if (Party[partyName] != party) continue;
	        await player.sendMessage(`Phe của ${target.name} là /${partyName}/`);
	        break;
	    }
	}
};
