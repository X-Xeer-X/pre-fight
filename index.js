/*
Modified by jenoveil for account with multiple marrow/quatrefoil brooch
Simple QC: 19705, yellow QC: 19706
Stormcry patch: new yellow QC: 98405
guardian twin swords = 88323
stormcry twin swords = 88372
guardian fist = 83292 for testing
stormcry fist = 88382 for testing
NOTE: place cdr weapon in TOP LEFT SLOT OF BAG
*/

const	TRIGGER_ITEM = 6560,     // minor replenishment potable
		marrow = 51028,
		quatreBrooches =[51011], // TODO: missing id for new patch quatre brooch
		empoweredBrooches = [19703,98405], // empowered IDs
		secondaryBrooches = [19706,98405], // quickcarve IDs
		TEST_SLOT = 40,
		DEADLY_GAMBLE = 67309064,
		JOB_WARRIOR = 0;

module.exports = function broochSwap(dispatch){
	let	cid,
		job,
		model,
		w_enable,
		location,
		secondaryBroochSlot,
		primaryBroochSlot,
		quickcarveID = quickcarve;

	dispatch.hook('S_LOGIN', 1, (event) => {

		({cid, model} = event);
		job = (model - 10101) % 100;
		w_enable = [JOB_WARRIOR].includes(job);

	});

	dispatch.hook('C_PLAYER_LOCATION', 1, event =>{location = event})

	dispatch.hook('C_USE_ITEM', 1, event =>{
		if(event.item == TRIGGER_ITEM){

			// equip quickcarve and CDR weapon
			dispatch.toServer('C_EQUIP_ITEM', 1,{
				cid: cid,
				slot: secondaryBroochSlot,
				unk: 0
			})

			if (w_enable) {

				dispatch.toServer('C_EQUIP_ITEM', 1, {

					cid: cid,
					slot: TEST_SLOT,
					unk: 0

				});

				Gamble = setTimeout(gamble,150)

			} else {

				timeout = setTimeout(broochSwap,150)

			}




		}
	})
	// prioritize assign marrow > quatre > empowered to primary slot
	dispatch.hook('S_INVEN', 5, event =>{
		var priority = 3; // 1 = marrow, 2 = quatre, 3 = empowered
		for ( var i = 0; i < event.items.length; i++) {
			if (event.items[i].item == marrow && priority >= 1) {
				primaryBroochSlot = event.items[i].slot;
				break; // end search once marrow found
			}
			else if (quatreBrooches.includes(event.items[i].item) && priority >= 2) {
				primaryBroochSlot = event.items[i].slot;
				break; // skip searching for empowered once quatre found
			}
			else if (empoweredBrooches.includes(event.items[i].item) && priority == 3) {

				primaryBroochSlot  = event.items[i].slot;
				break;
			}
		}
		for ( var i = 0; i < event.items.length; i++) {

			if (secondaryBrooches.includes(event.items[i].item)) {
				quickcarveID = event.items[i].item;
				secondaryBroochSlot = event.items[i].slot;
				break;
			}

		}
	})

	function broochSwap(){
		clearTimeout(timeout)
		dispatch.toServer('C_USE_ITEM', 1,{
			ownerId: cid,
			item: quickcarveID,
			id: 0,
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 1,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			x: location.x1,
			y: location.y1,
			z: location.z1,
			w: location.w,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 1
		})

		// pop deadly gamble here
		primary = setTimeout(equipMain,150)
	}

	function equipMain() {

		clearTimeout(primary)
		// equip main weapon and brooch here
		if (w_enable) {

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
