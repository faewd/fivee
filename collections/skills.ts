import { collection } from "$db/collection.ts";
import { BaseDocument, Source } from "$collections/_common.ts";
import { AbilityScore } from "$collections/abilityScores.ts";
import { md, ref, source } from "$helpers";

/*
 * TypeScript Types
 */

export interface Skill extends BaseDocument {
  desc: string;
  baseAbility: AbilityScore;
  source: Source;
}

/*
 * Data
 */

export default collection<Skill>({
  id: "skills",
  docType: "skill",
  typeDefs: `#graphql
    type Skill {
      id: String!
      name: String!
      desc: String!
      baseAbility: AbilityScore!
      source: Source!
    }

    extend type Query {
      skills: [Skill]
      skill(id: String!): Skill
    }
  `,
  entries: [
    {
      id: "acrobatics",
      name: "Acrobatics",
      desc: md`
        Your Dexterity (Acrobatics) check covers your attempt to stay on your feet in a tricky
        situation, such as when you're trying to run across a sheet of ice, balance on a tightrope, or
        stay upright on a rocking ship's deck. The GM might also call for a Dexterity (Acrobatics)
        check to see if you can perform acrobatic stunts, including dives, rolls, somersaults, and
        flips.
      `,
      baseAbility: ref("abilityScores", "dex"),
      source: source("PHB", 176),
    },
    {
      id: "animalHandling",
      name: "Animal Handling",
      desc: md`
        When there is any question whether you can calm down a domesticated animal, keep a mount from
        getting spooked, or intuit an animal's intentions, the GM might call for a Wisdom
        (Animal Handling) check. You also make a Wisdom (Animal Handling) check to control your mount
        when you attempt a risky maneuver.
      `,
      baseAbility: ref("abilityScores", "wis"),
      source: source("PHB", 178),
    },
    {
      id: "arcana",
      name: "Arcana",
      desc: md`
        Your Intelligence (Arcana) check measures your ability to recall lore about spells, magic
        items, eldritch symbols, magical traditions, the planes of existence, and the inhabitants of
        those planes.
      `,
      baseAbility: ref("abilityScores", "int"),
      source: source("PHB", 177),
    },
    {
      id: "athletics",
      name: "Athletics",
      desc: md`
        Your Strength (Athletics) check covers difficult situations you encounter while climbing,
        jumping, or swimming. Examples include the following activities:

        - You attempt to climb a sheer or slippery cliff, avoid hazards while scaling a wall, or cling
          to a surface while something is trying to knock you off.
        - You try to jump an unusually long distance or pull off a stunt midjump.
        - You struggle to swim or stay afloat in treacherous currents, storm-tossed waves, or areas of
          thick seaweed. Or another creature tries to push you underwater or otherwise interfere with
          you swimming.
      `,
      baseAbility: ref("abilityScores", "str"),
      source: source("PHB", 175),
    },
    {
      id: "deception",
      name: "Deception",
      desc: md`
        Your Charisma (Deception) check determines whether you can convincingly hide the truth, either
        verbally or through your actions. This deception can encompass everything from misleading
        others through ambiguity to telling outright lies. Typical situations include trying to fast-
        talk a guard, con a merchant, earn money through gambling, pass yourself off in a disguise,
        dull someone's suspicions with false assurances, or maintain a straight face while telling a
        blatant lie.
      `,
      baseAbility: ref("abilityScores", "cha"),
      source: source("PHB", 178),
    },
    {
      id: "history",
      name: "History",
      desc: md`
        Your Intelligence (History) check measures your ability to recall lore about historical
        events, legendary people, ancient kingdoms, past disputes, recent wars, and lost
        civilizations.
      `,
      baseAbility: ref("abilityScores", "int"),
      source: source("PHB", 177),
    },
    {
      id: "insight",
      name: "Insight",
      desc: md`
        Your Wisdom (Insight) check decides whether you can determine the true intentions of a
        creature, such as when searching out a lie or predicting someone's next move. Doing so
        involves gleaning clues from body language, speech habits, and changes in mannerisms.
      `,
      baseAbility: ref("abilityScores", "wis"),
      source: source("PHB", 178),
    },
    {
      id: "intimidation",
      name: "Intimidation",
      desc: md`
        When you attempt to influence someone through overt threats, hostile actions, and physical
        violence, the GM might ask you to make a Charisma (Intimidation) check. Examples include
        trying to pry information out of a prisoner, convincing street thugs to back down from a
        confrontation, or using the edge of a broken bottle to convince a sneering vizier to
        reconsider a decision.
      `,
      baseAbility: ref("abilityScores", "cha"),
      source: source("PHB", 179),
    },
    {
      id: "investigation",
      name: "Investigation",
      desc: md`
        When you look around for clues and make deductions based on those clues, you make an
        Intelligence (Investigation) check. You might deduce the location of a hidden object, discern
        from the appearance of a wound what kind of weapon dealt it, or determine the weakest point in
        a tunnel that could cause it to collapse. Poring through ancient scrolls in search of a hidden
        fragment of knowledge might also call for an Intelligence (Investigation) check.
      `,
      baseAbility: ref("abilityScores", "int"),
      source: source("PHB", 178),
    },
    {
      id: "medicine",
      name: "Medicine",
      desc: md`
        A Wisdom (Medicine) check lets you try to stabilize a dying companion or diagnose an illness.
      `,
      baseAbility: ref("abilityScores", "wis"),
      source: source("PHB", 178),
    },
    {
      id: "nature",
      name: "Nature",
      desc: md`
        Your Intelligence (Nature) check measures your ability to recall lore about terrain, plants
        and animals, the weather, and natural cycles.
      `,
      baseAbility: ref("abilityScores", "int"),
      source: source("PHB", 178),
    },
    {
      id: "perception",
      name: "Perception",
      desc: md`
        Your Wisdom (Perception) check lets you spot, hear, or otherwise detect the presence of
        something. It measures your general awareness of your surroundings and the keenness of your
        senses. For example, you might try to hear a conversation through a closed door, eavesdrop
        under an open window, or hear monsters moving stealthily in the forest. Or you might try to
        spot things that are obscured or easy to miss, whether they are orcs lying in ambush on a
        road, thugs hiding in the shadows of an alley, or candlelight under a closed secret door.
      `,
      baseAbility: ref("abilityScores", "wis"),
      source: source("PHB", 178),
    },
    {
      id: "performance",
      name: "Performance",
      desc: md`
        Your Charisma (Performance) check determines how well you can delight an audience with music,
        dance, acting, storytelling, or some other form of entertainment.
      `,
      baseAbility: ref("abilityScores", "cha"),
      source: source("PHB", 179),
    },
    {
      id: "persuasion",
      name: "Persuasion",
      desc: md`
        When you attempt to influence someone or a group of people with tact, social graces, or good
        nature, the GM might ask you to make a Charisma (Persuasion) check. Typically, you use
        persuasion when acting in good faith, to foster friendships, make cordial requests, or exhibit
        proper etiquette. Examples of persuading others include convincing a chamberlain to let your
        party see the king, negotiating peace between warring tribes, or inspiring a crowd of
        townsfolk.
      `,
      baseAbility: ref("abilityScores", "cha"),
      source: source("PHB", 179),
    },
    {
      id: "religion",
      name: "Religion",
      desc: md`
        Your Intelligence (Religion) check measures your ability to recall lore about deities, rites
        and prayers, religious hierarchies, holy symbols, and the practices of secret cults.
      `,
      baseAbility: ref("abilityScores", "int"),
      source: source("PHB", 178),
    },
    {
      id: "sleightOfHand",
      name: "Sleight of Hand",
      desc: md`
        Whenever you attempt an act of legerdemain or manual trickery, such as planting something on
        someone else or concealing an object on your person, make a Dexterity (Sleight of Hand) check.
        The GM might also call for a Dexterity (Sleight of Hand) check to determine whether you can
        lift a coin purse off another person or slip something out of another person's pocket.
      `,
      baseAbility: ref("abilityScores", "dex"),
      source: source("PHB", 177),
    },
    {
      id: "stealth",
      name: "Stealth",
      desc: md`
        Make a Dexterity (Stealth) check when you attempt to conceal yourself from enemies, slink past
        guards, slip away without being noticed, or sneak up on someone without being seen or heard.
      `,
      baseAbility: ref("abilityScores", "dex"),
      source: source("PHB", 177),
    },
    {
      id: "survival",
      name: "Survival",
      desc: md`
        The GM might ask you to make a Wisdom (Survival) check to follow tracks, hunt wild game,
        guide your group through frozen wastelands, identify signs that owlbears live nearby, predict
        the weather, or avoid quicksand and other natural hazards.
      `,
      baseAbility: ref("abilityScores", "wis"),
      source: source("PHB", 178),
    },
  ],
});
