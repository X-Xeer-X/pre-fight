/*
Modified by jenoveil for account with multiple marrow/quatrefoil brooch
Simple QC: 19705, yellow QC: 19706
Stormcry patch: new yellow QC: 98405
guardian twin swords = 88323
stormcry twin swords = 88372
guardian fist = 83292 for testing
stormcry fist = 88382 for testing
NOTE: place cdr weapon in TOP LEFT SLOT OF BAG
NOTE: toggle command added to toggle use of pre-fight steroid skill with double brooch
*/

const Command = require('command');
const	TRIGGER_ITEM = 6560,     // minor replenishment potable
		secondaryBrooches = [19706,98405], // quickcarve IDs
		TEST_SLOT = 40,
		DEADLY_GAMBLE = 67309064,
		JOB_WARRIOR = 0;

module.exports = function broochSwap(dispatch){
	const command = Command(dispatch);
	let	cid,
		job,
		model,
		w_enable,
		toggle = true,
		location,
		broochSlot,
		primaryBroochSlot,
		quickcarveID = secondaryBrooches[0];

	command.add('toggle', () => {
		toggle = !toggle;
		command.message('Brooch swap with DG ' + (toggle ? 'enabled' : 'disabled') + '.');
	});

	dispatch.hook('S_LOGIN', 1, (event) => {

		({cid, model} = event);
		job = (model - 10101) % 100;
		w_enable = [JOB_WARRIOR].includes(job);

	});

	dispatch.hook('C_PLAYER_LOCATION', 1, event =>{location = event})

	dispatch.hook('S_INVEN', 5, event =>{
		for ( var i = 0; i < event.items.length; i++) {
			if (secondaryBrooches.includes(event.items[i].item)) {
				quickcarveID = event.items[i].item;
				if (i < 40) {
					broochSlot = event.items[i].slot;
				}
				break;
			}
		}
	})

	dispatch.hook('C_USE_ITEM', 1, event =>{
		if(event.item == TRIGGER_ITEM){
			// equip quickcarve and CDR weapon
			dispatch.toServer('C_EQUIP_ITEM', 1,{
				cid: cid,
				slot: broochSlot,
				unk: 0
			})
			primaryBroochSlot = broochSlot;

			if (w_enable && toggle) {
				dispatch.toServer('C_EQUIP_ITEM', 1, {
					cid: cid,
					slot: TEST_SLOT,
					unk: 0
				});

				Gamble = setTimeout(gamble,300)

			} else {
				timeout = setTimeout(broochSwap,300)
			}

		}
	})

	function broochSwap(){
		clearTimeout(timeout)
		dispatch.toServer('C_USE_ITEM', 2,{
			ownerId: cid,
			id: quickcarveID,
			uniqueId: {
				low: 0,
				high: 0,
				unsigned: true
			},
			targetId: {
				low: 0,
				high: 0,
				unsigned: true
			},
			amount: 1,
			targetX: 0,
			targetY: 0,
			targetZ: 0,
			x: location.x1,
			y: location.y1,
			z: location.z1,
			w: location.w,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 1
		})

		// pop deadly gamble here
		primary = setTimeout(equipMain,300)
	}

	function equipMain() {

		clearTimeout(primary)
		// equip main weapon and brooch here
		if (w_enable && toggle) {
			dispatch.toServer('C_EQUIP_ITEM', 1, {
				cid: cid,
				slot: TEST_SLOT,
				unk: 0
			});
		}
		dispatch.toServer('C_EQUIP_ITEM',1, {
			cid: cid,
			slot: primaryBroochSlot,
			unk: 0
		})
	}

	function gamble() {

		clearTimeout(Gamble)

		dispatch.toServer('C_START_SKILL',1, {
			skill: DEADLY_GAMBLE,
			w: location.w,
			x: location.x1,
			y: location.y1,
			z: location.z1,
			toX: 0,
			toY: 0,
			toZ: 0,
			unk: true,
			moving: false,
			continue: false,
			target: {
				low: 0,
				high: 0,
				unsigned: true
			}
		});

		timeout = setTimeout(broochSwap,300)

	}
}
