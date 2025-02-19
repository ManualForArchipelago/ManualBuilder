export const Tooltips = {
    SIDEBAR_GAME: "The name of the game that you're making a Manual apworld for.",
    SIDEBAR_CREATOR: "People can have variations on a Manual randomizer approach, so we identify yours by your (probably Discord) name.",
    SIDEBAR_FILLER_NAME: "When generation runs out of items from your list to place somewhere, it needs to place 'filler' items. Choose what those are called by default. (You can still define more filler items in the Items tab to the right if you want multiple filler names beyond this.)",
    SIDEBAR_CHOOSE_FILE: "If you have a functional Manual apworld file that you created before, you can choose that here. Then click the Import button below to pull the items/locations/etc. from that apworld into this tool.",

    ITEMS_NAME: "The name that the item will have in the multiworld, such as in hints or when viewed in the Manual client.",
    ITEMS_CATEGORIES: "Categories are used by the Manual client to group together items and locations. They also allow placing a random item from a category in a location, if you choose.",
    ITEMS_CLASSIFICATION: "The classification of an item determines how AP values placing the item. Progression means that it unlocks locations to check, useful means that it should not be excluded, and filler/trap are both non-essential.",
    ITEMS_COUNT: "How many of this item name do you want in the multiworld?",

    LOCATIONS_NAME: "This is the name of the location, as it would show up in the multiworld when hinting for items. Also what is displayed in the Manual client.",
    LOCATIONS_CATEGORIES: "Categories are used by the Manual client to group together items and locations. Also affects how locations are grouped in the Manual client.",
    LOCATIONS_REGION: "A region is a collection of locations that are in a similar 'area'. (If you're not sure what to put here, skip it.) Options listed here come from the Regions tab.",
    LOCATIONS_REQUIREMENTS: "Location requirements are your randomizer's logic, essentially. The requirements listed here must be met for the location to be accessible (in logic). You may only use item names/categories (and, optionally, a count of that item/category with ':2', for example) for these requirements.<br><br>If your requirement uses an item category name, preface that category name with @.",
    LOCATIONS_PLACE_ITEM: "You can use this option to place a random item from a list, or a random item from a specific category, at a location. You can also specify only 1 item if you like. This will only ever choose one item to place.<br><br>If you change nothing here, this location will get any random item as normal.",
    LOCATIONS_VICTORY: "You need at least 1 victory location to allow your randomizer to complete. By marking a location as victory, its requirements will be used by AP to determine the requirements for being able to complete the game. Since a victory location is the last location before completion, no items are placed here.",

    REGIONS_NAME: "The name of the region that would contain locations. This is only shown in this Builder (as an option on your locations), and is not displayed in the multiworld.",
    REGIONS_CONNECTS_TO: "Complete the following sentence: This region CONNECTS TO the ________ regions. Just other region names separated by commas.<br><br>Also, these are defined as forward-only exits/connections, so you only define them on the region you're starting FROM. (It's implied that you can return to regions you've reached before.)<br><br>Finally, if this region is a starting region, it doesn't need to be listed in other regions' 'connects to' to be reachable.",
    REGIONS_STARTING_REGION: "Determines whether this region is reachable from the beginning of the game. If none of your regions use this option, all regions are accessible from the beginning. If any of your regions use this option, the regions that don't must be listed in a Connects To of another region to be accessible.",
    REGIONS_REQUIREMENTS: "Region requirements are your randomizer's logic, essentially. The requirements listed here must be met for the region, and any locations in the region, to be accessible (in logic). You may only use item names/categories (and, optionally, a count of that item/category with ':2', for example) for these requirements.<br><br>If your requirement uses an item category name, preface that category name with @."
};
