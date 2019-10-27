const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express')
const app = express();
const request = require('request');
const https = require('https');


app.get('/', function (req, res) {
	res.send('Hello World!')
})

app.listen(3000, function () {

	function getSpell(i) {

		if (i < 12000) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/sorts/details?id=" + i;
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-spell-name") != undefined) {
					let content = dom.window.document.querySelector(".ak-spell-name").innerHTML;
					fs.appendFile('spells.txt', '(' + i + ', "' + content.split("\n")[1] + '"),\n', (err) => {
						if (err) throw err;
						console.log(i, 'OK');
						i++;
						getSpell(i);
					});
				}
				else {
					console.log(i, 'KO');
					i++;
					getSpell(i);
				}
			}).catch(err => {
				console.log(i, 'STOP');
			});
		}
	}

	function getIdol(i) {

		if (i < 102) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/idoles/" + i + "-idol";
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-return-link") != undefined) {
					let name = dom.window.document.querySelector(".ak-return-link").innerHTML.split("\n")[4];
					let level = dom.window.document.querySelector(".ak-encyclo-detail-level").innerHTML.split("\n")[1].split(": ")[1];
					let score = dom.window.document.querySelector(".ak-title-info").innerHTML;
					fs.appendFile('idols.txt', 'idols.add(new Idol(' + i + ', "' + name + '",' + level + ',' + score + '));\n', (err) => {
						if (err) throw err;
						console.log(i, 'OK');
						i++;
						getIdol(i);
					});
				}
				else {
					console.log(i, 'KO');
					i++;
					getIdol(i);
				}
			}).catch(err => {
				console.log(i, 'ERROR');
				i++;
				getIdol(i);
			});
		}
	}

	function getMount(i) {

		if (i < 90) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/montures/" + i + "-mount";
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-return-link") != undefined) {
					let name = dom.window.document.querySelector(".ak-return-link").innerHTML.split("\n")[4];
					fs.appendFile('mounts.txt', 'mounts.add(new Mount(' + i + ', "' + name + '"));\n', (err) => {
						if (err) throw err;
						console.log(i, 'OK');
						i++;
						getMount(i);
					});
				}
				else {
					console.log(i, 'KO');
					i++;
					getMount(i);
				}
			}).catch(err => {
				console.log(i, 'ERROR');
				i++;
				getMount(i);
			});
		}
	}

	function getItem(i) {

		if (i < 21000) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/equipements/" + i + "-item";
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-return-link") != undefined) {
					let name = dom.window.document.querySelector(".ak-return-link").innerHTML.split("\n")[4];
					if (dom.window.document.querySelector(".ak-encyclo-detail-illu .img-maxresponsive") != undefined) {
						let imageId = dom.window.document.querySelector(".ak-encyclo-detail-illu .img-maxresponsive").src.split('/').pop().split('.')[0];
						fs.appendFile('items.txt', '(' + i + ', "' + name + '",' + imageId + '));\n', (err) => {
							if (err) throw err;
							console.log(i, 'OK');
							i++;
							getItem(i);
						});
					}
					else {
						console.log(i, 'KO');
						i++;
						getItem(i);
					}
				}
				else {
					console.log(i, 'KO');
					i++;
					getItem(i);
				}
			}).catch(err => {
				console.log(i, 'ERROR');
				i++;
				getItem(i);
			});
		}
	}

	function getMob(i) {

		if (i < 6000) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/monstres/" + i + "-mob";
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-return-link") != undefined) {
					let name = dom.window.document.querySelector(".ak-return-link").innerHTML.split("\n")[4];
					let levelMin = dom.window.document.querySelector(".ak-encyclo-detail-level").innerHTML.split("\n")[1].split(": ")[1].split(" à ")[0];
					let levelMax = dom.window.document.querySelector(".ak-encyclo-detail-level").innerHTML.split("\n")[1].split(": ")[1].split(" à ")[1];
					if (levelMax == undefined) {
						levelMax = levelMin;
					}
					fs.appendFile('mobs.txt', 'mobs.add(new Mob(' + i + ', "' + name + '",' + levelMin + ',' + levelMax + '));\n', (err) => {
						if (err) throw err;
						console.log(i, 'OK');
						i++;
						getMob(i);
					});
				}
				else {
					console.log(i, 'KO');
					i++;
					getMob(i);
				}
			}).catch(err => {
				console.log(i, 'ERROR');
				i++;
				getMob(i);
			});
		}
	}

	function getSet(i) {

		if (i < 457) {
			let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/panoplies/" + i + "-set";
			JSDOM.fromURL(url).then(dom => {
				if (dom.window.document.querySelector(".ak-return-link") != undefined) {
					let name = dom.window.document.querySelector(".ak-return-link").innerHTML.split("\n")[4];
					fs.appendFile('sets.txt', 'sets.add(new Set(' + i + ', "' + name + '"));\n', (err) => {
						if (err) throw err;
						console.log(i, 'OK');
						i++;
						getSet(i);
					});
				}
				else {
					console.log(i, 'KO');
					i++;
					getSet(i);
				}
			}).catch(err => {
				console.log(i, 'ERROR');
				i++;
				getSet(i);
			});
		}
	}

	function download(uri, filename, callback) {
		request.head(uri, function (err, res, body) {
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};

	function getSpellImage(i) {
		let url = "https://www.dofus.com/fr/mmorpg/encyclopedie/sorts/details?id=" + i;
		JSDOM.fromURL(url).then(dom => {
			if (dom.window.document.querySelector(".ak-spell-details-illu") != undefined) {
				let url = dom.window.document.querySelector(".ak-spell-details-illu span img").src;
				let name = 'spells/' + i + '.png';
				download(url, name, function () {
					console.log(i);
					i++;
					getSpellImage(i);
				});
			}
			else {
				console.log(i, 'KO');
				i++;
				getSpellImage(i);
			}
		}).catch(err => {
			console.log(i, 'STOP');
		});
	}

	let mobGradeId = 1;
	let subareaId = 1;
	let dropId = 1;
	let spellGradeId = 1;

	getSpellInfos(1);

	function getMobInfos(i) {
		const url = "https://dofensive.com/api/monster.php?Id=" + i + "&Language=fr";
		https.get(url, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.log(i);
				i++;
				let monster = JSON.parse(data);
				if (monster !== -1) {
					analyzeMonsterInfos(monster);
					setTimeout(function () {
						getMobInfos(i)
					}, 1500);
				} else {
					getMobInfos(i);
				}
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}

	function getSpellInfos(i) {
		const url = "https://dofensive.com/api/spell.php?Id=" + i + "&Language=fr";
		https.get(url, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.log(i);
				i++;
				let spell = JSON.parse(data);
				if (spell !== -1) {
					analyzeSpellInfos(spell);
					setTimeout(function () {
						getSpellInfos(i);
					}, 1500);
				} else {
					getSpellInfos(i);
				}
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}
	
	function getStateInfos(i) {
		const url = "https://dofensive.com/api/state.php?Id=" + i + "&Language=fr";
		https.get(url, (resp) => {
			let data = '';

			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on('end', () => {
				console.log(i);
				i++;
				let state = JSON.parse(data);
				if (state !== -1) {
					let value = "(";
					const id= state.Id;
					value += id;
					const name = state.Name;
					value += ", \"" + name;
					const preventsSpellCast  = state.PreventsSpellCast ? 1 : 0;
					value += "\", " + preventsSpellCast;
					const preventsFight  = state.PreventsFight ? 1 : 0;
					value += ", " + preventsFight;
					const isSilent  = state.IsSilent ? 1 : 0;
					value += ", " + isSilent;
					const cantBeMoved  = state.CantBeMoved ? 1 : 0;
					value += ", " + cantBeMoved;
					const cantBePushed  = state.CantBePushed ? 1 : 0;
					value += ", " + cantBePushed;
					const cantDealDamage  = state.CantDealDamage ? 1 : 0;
					value += ", " + cantDealDamage;
					const cantSwitchPosition  = state.CantSwitchPosition ? 1 : 0;
					value += ", " + cantSwitchPosition;
					const incurable  = state.Incurable ? 1 : 0;
					value += ", " + incurable;
					const invulnerable  = state.Invulnerable ? 1 : 0;
					value += ", " + invulnerable;
					const invulnerableMelee  = state.InvulnerableMelee ? 1 : 0;
					value += ", " + invulnerableMelee;
					const invulnerableRange  = state.InvulnerableRange ? 1 : 0;
					value += ", " + invulnerableRange + "),\n";
					fs.appendFile('states.txt', value, (err) => {
						if (err) throw err;
						getStateInfos(i);
					});
				} else {
					getStateInfos(i);
				}
			});

		}).on("error", (err) => {
			console.log("Error: " + err.message);
		});
	}

	function getMonsterImage(index) {
		let url = 'https://s.ankama.com/www/static.ankama.com/dofus/www/game/monsters/200/' + index + '.w200h200.png';
		let name = 'monsters/' + index + '.png';
		download(url, name, function () {
			console.log(index);
			getMonsterImage(index + 1);
		});
	}

	function analyzeMonsterInfos(monster) {

		let value = "(";
		const id = monster.Id;
		value += id;
		const name = monster.Name;
		value += ", \"" + name + "\"";
		const race = monster.Race;
		value += ", \"" + race + "\"";
		const family = monster.Family;
		value += ", \"" + family + "\"";
		const type = monster.Type;
		value += ", " + type;
		const canPlay = monster.CanPlay ? 1 : 0;
		value += ", " + canPlay;
		const canTackle = monster.CanTackle ? 1 : 0;
		value += ", " + canTackle;
		const canBePushed = monster.CanBePushed ? 1 : 0;
		value += ", " + canBePushed;
		const canSwitchPos = monster.CanSwitchPos ? 1 : 0;
		value += ", " + canSwitchPos;
		const allIdolsDisabled = monster.AllIdolsDisabled ? 1 : 0;
		value += ", " + allIdolsDisabled;
		const aggressiveZoneSize = monster.AggressiveZoneSize ? 1 : 0;
		value += ", " + aggressiveZoneSize;
		let complementaryMonster = 'NULL';
		if (monster.ComplementaryMonster) {
			complementaryMonster = monster.ComplementaryMonster.Id;
		}
		value += ", " + complementaryMonster + "),\n";
		fs.appendFile('mobs.txt', value, (err) => {
			if (err) throw err;
		});

		monster.Grades.forEach((grade) => {

			let valueGrade = "(";

			valueGrade += mobGradeId;
			const level = grade.Level;
			valueGrade += ", " + level;
			const lifePoints = grade.LifePoints;
			valueGrade += ", " + lifePoints;
			const actionPoints = grade.ActionPoints;
			valueGrade += ", " + actionPoints;
			const movementPoints = grade.MovementPoints;
			valueGrade += ", " + movementPoints;
			const apDodge = grade.PaDodge;
			valueGrade += ", " + apDodge;
			const mpDodge = grade.PmDodge;
			valueGrade += ", " + mpDodge;
			const wisdom = grade.Wisdom;
			valueGrade += ", " + wisdom;
			let strength = 0;
			let intelligence = 0;
			let chance = 0;
			let agility = 0;
			if (grade.PrimaryStastics) {
				strength = grade.PrimaryStastics.Strength;
				intelligence = grade.PrimaryStastics.Intelligence;
				chance = grade.PrimaryStastics.Chance;
				agility = grade; PrimaryStastics.Agility;
			}
			valueGrade += ", " + strength;
			valueGrade += ", " + intelligence;
			valueGrade += ", " + chance;
			valueGrade += ", " + agility;
			let resNeutral = 0;
			let resEarth = 0;
			let resFire = 0;
			let resWater = 0;
			let resAir = 0;
			if (grade.Resistances) {
				resNeutral = grade.Resistances.Neutral;
				resEarth = grade.Resistances.Earth;
				resFire = grade.Resistances.Fire;
				resWater = grade.Resistances.Water;
				resAir = grade.Resistances.Air;
			}
			valueGrade += ", " + resNeutral;
			valueGrade += ", " + resEarth;
			valueGrade += ", " + resFire;
			valueGrade += ", " + resWater;
			valueGrade += ", " + resAir;
			const reflect = grade.DamageReflect;
			valueGrade += ", " + reflect;
			const experience = grade.Experience;
			valueGrade += ", " + experience;
			const aggressiveLevel = grade.AggressiveLevel;
			valueGrade += ", " + aggressiveLevel;
			valueGrade += ", " + id + "),\n";

			fs.appendFile('mobGrades.txt', valueGrade, (err) => {
				if (err) throw err;
			});

			if (grade.Drops) {
				grade.Drops.forEach((drop) => {
					let valueDrop = "(";
					valueDrop += dropId;
					const probability = drop.Probability;
					valueDrop += ", " + probability;
					const isConditional = drop.IsConditional ? 1 : 0;
					valueDrop += ", " + isConditional;
					const item = drop.Id;
					valueDrop += ", " + item;
					valueDrop += "),\n";
					fs.appendFile('drops.txt', valueDrop, (err) => {
						if (err) throw err;
					});

					let valueDropMobGrade = "(";
					valueDropMobGrade += dropId;
					valueDropMobGrade += ", " + mobGradeId;
					valueDropMobGrade += "),\n";
					fs.appendFile('drops_mobgrades.txt', valueDropMobGrade, (err) => {
						if (err) throw err;
					});

					dropId++;
				});
			}

			mobGradeId++;
		});

		monster.IncompatibleIdols.forEach((idol) => {
			let valueIdol = "(";
			const idolId = idol.Id;
			valueIdol += idolId;
			valueIdol += ", " + id + "),\n";
			fs.appendFile('idols_mobs.txt', valueIdol, (err) => {
				if (err) throw err;
			});
		});

		monster.IncompatibleChallenges.forEach((challenge) => {
			let valueChallenge = "(";
			const challengeId = challenge.Id;
			valueChallenge += challengeId;
			valueChallenge += ", " + id + "),\n";
			fs.appendFile('challenges_mobs.txt', valueChallenge, (err) => {
				if (err) throw err;
			});
		});

		monster.Spells.forEach((spell) => {
			let valueSpell = "(";
			const spellId = spell.Id;
			valueSpell += id;
			valueSpell += ", " + spellId + "),\n";
			fs.appendFile('spells_mobs.txt', valueSpell, (err) => {
				if (err) throw err;
			});
		});

		if (monster.InfiniteDreamSpells) {
			monster.InfiniteDreamSpells.DreamSpells.forEach((dreamSpell) => {
				let valueDreamSpell = "(";
				const dreamSpellId = dreamSpell.Id;
				valueDreamSpell += id;
				valueDreamSpell += ", " + dreamSpellId + "),\n";
				fs.appendFile('dreamspells_mobs.txt', valueDreamSpell, (err) => {
					if (err) throw err;
				});
			});

			monster.InfiniteDreamSpells.ParadoxSpells.forEach((paradoxSpell) => {
				let valueParadoxSpell = "(";
				const paradoxSpellId = paradoxSpell.Id;
				valueParadoxSpell += id;
				valueParadoxSpell += ", " + paradoxSpellId + "),\n";
				fs.appendFile('paradoxspells_mobs.txt', valueParadoxSpell, (err) => {
					if (err) throw err;
				});
			});

			monster.InfiniteDreamSpells.NightmareSpells.forEach((nightmareSpell) => {
				let valueNightmareSpell = "(";
				const nightmareSpellId = nightmareSpell.Id;
				valueNightmareSpell += id;
				valueNightmareSpell += ", " + nightmareSpellId + "),\n";
				fs.appendFile('nightmarespells_mobs.txt', valueNightmareSpell, (err) => {
					if (err) throw err;
				});
			});
		}

		monster.Subareas.forEach((subarea) => {
			let valueSubarea = "(";

			valueSubarea += subareaId;
			const subaeraName = subarea.Name;
			valueSubarea += ", \"" + subaeraName;
			valueSubarea += "\"),\n";
			fs.appendFile('subareas.txt', valueSubarea, (err) => {
				if (err) throw err;
			});

			let valueSubAreaMob = "(";
			valueSubAreaMob += id;
			valueSubAreaMob += ", " + subareaId + "),\n";
			fs.appendFile('subareas_mobs.txt', valueSubAreaMob, (err) => {
				if (err) throw err;
			});
			subareaId++;
		});
	}

	function analyzeSpellInfos(spell) {
		let spellValue = "(";
		const spellId = spell.Id;
		spellValue += spellId;
		const spellName = spell.Name;
		spellValue += ", \"" + spellName;
		spellValue += "\"),\n";
		/*fs.appendFile('spells.txt', spellValue, (err) => {
			if (err) throw err;
		});*/

		spell.Levels.forEach((spellLevel) => {
			console.log(spellLevel);
			let spellGradeValue  = "(";
			spellGradeValue += spellGradeId;
			const actionPoints = spellLevel.ActionPoints;
			spellGradeValue += ", " + actionPoints;
			const castInDiagonal = spellLevel.CastInDiagonal ? 1 : 0;
			spellGradeValue += ", " + castInDiagonal;
			const castInLine = spellLevel.CastInLine ? 1 : 0;
			spellGradeValue += ", " + castInLine;
			const castLineOfSight = spellLevel.CastLineOfSight ? 1 : 0;
			spellGradeValue += ", " + castLineOfSight;
			const criticalProbability = spellLevel.CriticalProbability;
			spellGradeValue += ", " + criticalProbability;
			const editableRange = spellLevel.EditableRange ? 1 : 0;
			spellGradeValue += ", " + editableRange;
			const globalCooldown = spellLevel.GlobalCooldown;
			spellGradeValue += ", " + globalCooldown;
			const initialCooldown = spellLevel.InitialCooldown;
			spellGradeValue += ", " + initialCooldown;
			const maxCastPerTarget = spellLevel.MaxCastPerTarget;
			spellGradeValue += ", " + maxCastPerTarget;
			const maxCastPerTurn = spellLevel.MaxCastPerTurn;
			spellGradeValue += ", " + maxCastPerTurn;
			const maxStack = spellLevel.MaxStack;
			spellGradeValue += ", " + maxStack;
			const minCastInterval = spellLevel.MinCastInterval;
			spellGradeValue += ", " + minCastInterval;
			const minRange = spellLevel.MinRange;
			spellGradeValue += ", " + minRange;
			const needFreeCell = spellLevel.NeedFreeCell ? 1 : 0;
			spellGradeValue += ", " + needFreeCell;
			const needFreeTrapCell = spellLevel.NeedFreeTrapCell ? 1 : 0;
			spellGradeValue += ", " + needFreeTrapCell;
			const needTakenCell = spellLevel.NeedTakenCell ? 1 : 0;
			spellGradeValue += ", " + needTakenCell;
			const range = spellLevel.Range;
			spellGradeValue += ", " + range;
			const spell = spellId;
			spellGradeValue += ", " + spell;
			spellGradeValue += "),\n";
			fs.appendFile('spells_grades.txt', spellGradeValue, (err) => {
				if (err) throw err;
			});
			spellGradeId++;
		});
	}
})