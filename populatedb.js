#! /usr/bin/env node

console.log('This script populates users, categories and sub-categories to the database. Specify database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return;
}

var async = require('async');
var User = require('./models/user');
var Category = require('./models/category');
var Item = require('./models/item');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var categories = [];
var items = [];

function userCreate(first_name, family_name, username, cb) {
    // Arrange/assign user details as it appears in the db
    userdetail = {
        first_name: first_name,
        family_name: family_name,
        username: username
    }

    var user = new User(userdetail);

    user.save(function(err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user)
        cb(null, user)
    });
}

function categoryCreate(title, user, cb) {
    categorydetail = {
        title: title,
        user: user
    }

    var category = new Category(categorydetail);
    category.save(function(err) {
        if (err) {
            cb(err, null)
            return;
        }
        console.log('New Category: ' + category);
        categories.push(category);
        cb(null, category);
    });
}

function itemCreate(title, description, category, user, cb) {
    var itemdetail = {
        title: title,
        description: description,
        category: category,
        user: user
    }

    var item = new Item(itemdetail);
    item.save(function(err) {
        if (err) {
            cb(err, null)
            return;
        }
        console.log('New Item: ' + item);
        items.push(item);
        cb(null, category);
    });
}

// Create user
function createUsers(cb) {
    async.parallel([
            function(callback) {
                userCreate('Moi', 'Aussi', 'moi', callback);
            }
        ],
        // Optional callback
        cb);
}

function createCategories(cb) {
    async.parallel([
            function(callback) {
                categoryCreate('Books', users[0], callback);
            },
            function(callback) {
                categoryCreate('Clothing', users[0], callback);
            },
            function(callback) {
                categoryCreate('Jewelry & Watches', users[0], callback);
            },
            function(callback) {
                categoryCreate('Cars', users[0], callback);
            },
            function(callback) {
                categoryCreate('Computers', users[0], callback);
            }
        ],
        // Optional callback
        cb);
}

function createItems(cb) {
    async.parallel([
            function(callback) {
                itemCreate('Audiobooks', "An audiobook (or talking book) is a recording of a text being read. A reading of the complete text is noted as 'unabridged', while readings of a reduced version, or abridgement of the text are labeled as 'abridged'.",
                    categories[0], users[0], callback);
            },
            function(callback) {
                itemCreate('Children Literature', "Children's literature or juvenile literature includes stories, books, magazines, and poems that are enjoyed by children. Modern children's literature is classified in two different ways: genre or the intended age of the reader.",
                    categories[0], users[0], callback);
            },
            function(callback) {
                itemCreate('Cookbooks', "A cookbook or cookery book is a kitchen reference publication containing a collection of recipes, typically organized by type of dish.",
                    categories[0], users[0], callback);
            },
            function(callback) {
                itemCreate('Fiction & Literature', "Fiction is the classification for any story or setting that is derived from imagination-in other words, not based strictly on history or fact.",
                    categories[0], users[0], callback);
            },
            function(callback) {
                itemCreate('Non-fiction', "Non-fiction or nonfiction is content (sometimes, in the form of a story) whose creator, in good faith, assumes responsibility for the truth or accuracy of the events, people, or information presented.",
                    categories[0], users[0], callback);
            },
            function(callback) {
                itemCreate('Dresses', "A dress (also known as a frock or a gown) is" +
                    " a garment consisting of a skirt with an attached bodice (or a matching " +
                    "bodice giving the effect of a one-piece garment). It consists of a top " +
                    "piece that covers the torso and hangs down over the legs. A dress can be " +
                    "any one-piece garment containing a skirt of any length. Dresses can be " +
                    "formal or informal.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate('Coats', "A coat is a garment worn by any gender, for warmth " +
                    "or fashion. Coats typically have long sleeves and are open down the front, " +
                    "closing by means of buttons, zippers, hook-and-loop fasteners, toggles, a " +
                    "belt, or a combination of some of these. Other possible features include " +
                    "collars, shoulder straps and hoods. Persians were the first people " +
                    "who made coats.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate("Children's clothing", "Children's clothing is clothing " +
                    "for children who have not yet grown to full height. Grandma bait is a retail " +
                    "industry term for expensive children's clothing. Children's clothing is often more " +
                    "casual than adult clothing, fit for play and rest. Hosiery is " +
                    "commonly used.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate('Tops', "A top is an item of clothing that covers at least the " +
                    "chest, but which usually covers most of the upper human body between the neck " +
                    "and the waistline.[1] The bottom of tops can be as short as mid-torso, or as " +
                    "long as mid-thigh. Men's tops are generally paired with pants, and women's with " +
                    "pants or skirts. Common types of tops are t-shirts, blouses and " +
                    "shirts.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate('Undergarments', "Undergarments are items of clothing worn beneath " +
                    "outer clothes, usually in direct contact with the skin, although they may comprise " +
                    "more than a single layer. They serve to keep outer garments from being " +
                    "soiled or damaged by bodily excretions, to lessen the friction of outerwear " +
                    "against the skin, to shape the body, and to provide concealment or support " +
                    "for parts of it.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate('Wedding dresses', "A wedding dress or wedding gown is the " +
                    "clothing worn by a bride during a wedding ceremony. Color, style and ceremonial " +
                    "importance of the gown can depend on the religion and culture of the wedding " +
                    "participants. In Western cultures, brides often choose white wedding dress, " +
                    "which was made popular by Queen Victoria in the 19th century.",
                    categories[1], users[0], callback);
            },
            function(callback) {
                itemCreate('Engagement & Wedding', "A wedding ring or wedding band is a " +
                    "finger ring that indicates that its wearer is married. It is usually forged from " +
                    "metal, and traditionally is forged of gold or another precious metal. The earliest " +
                    "examples of wedding rings are from Ancient Egypt.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Fashion Jewelry', "Costume jewelry, trinkets, fashion jewelry, " +
                    "junk jewelry, fake jewelry, or fallalery is jewelry manufactured as ornamentation " +
                    "to complement a particular fashionable costume or garment as opposed to 'real' " +
                    "(fine) jewelry which may be regarded primarily as collectibles, keepsakes, or " +
                    "investments.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Beads', "A bead is a small, decorative object that is formed " +
                    "in a variety of shapes and sizes of a material such as stone, bone, shell, " +
                    "glass, plastic, wood or pearl and that a small hole is drilled for threading " +
                    "or stringing. Beads range in size from under 1 millimetre (0.039 in) to over 1 " +
                    "centimetre (0.39 in) in diameter.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Bracelets', "A bracelet is an article of jewellery that is " +
                    "worn around the wrist. It may have a supportive function, such as holding a " +
                    "wristwatch or other items of jewellery such as religious symbols or charms. " +
                    "Medical and identity information is marked on some bracelets, such as " +
                    "allergy bracelets, hospital patient-identification tags, and bracelet tags " +
                    "for newborn babies.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Thumb Ring', "A thumb ring is a piece of equipment " +
                    "designed to protect the thumb during archery. This is a ring of leather, " +
                    "stone, horn, wood, bone, antler, ivory, metal, ceramics, plastic, or " +
                    "glass which fits over the end of the thumb, coming to rest at the outer " +
                    "edge of the outer joint.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Wrist Watches', "The concept of the wristwatch goes " +
                    "back to the production of the very earliest watches in the 16th century. " +
                    "Elizabeth I of England received a wristwatch from Robert Dudley in 1571, " +
                    "described as an arm watch. The oldest surviving wristwatch (then " +
                    "described as a bracelet watch) is one made in 1806 and given to Josephine " +
                    "de Beauharnais.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Automatic Watches', "A self-winding or automatic watch " +
                    "is one that rewinds the mainspring of a mechanical movement by the natural " +
                    "motions of the wearer's body. The first self-winding mechanism was " +
                    "invented for pocket watches in 1770 by Abraham-Louis Perrelet,[20] " +
                    "but the first 'self-winding', or 'automatic', wristwatch was the invention " +
                    "of a British watch repairer named John Harwood in 1923.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Smart Watches', "A smartwatch is a computerized " +
                    "wristwatch. While early models can perform basic tasks, such as " +
                    "calculations, translations, and game-playing, 2010s smartwatches are " +
                    "effectively wearable computers. Many run mobile apps, using a mobile " +
                    "operating system. Some smartwatches function as portable media players, " +
                    "with FM radio and playback of digital audio and video files via a " +
                    "Bluetooth or USB headset.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Emblem', "An emblem is an abstract or representational " +
                    "pictorial image that represents a concept, like a moral truth, or an " +
                    "allegory, or a person, like a king or saint. Although the words emblem and " +
                    "symbol are often used interchangeably, an emblem is a pattern that is used to " +
                    "represent an idea or an individual.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Earring', "An earring is a piece of jewellery attached to the " +
                    "ear via a piercing in the earlobe or another external part of the ear (except in " +
                    "the case of clip earrings, which clip onto the lobe). Earrings are worn by both " +
                    "sexes, although more common among women, and have been used by different " +
                    "civilizations in different times.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Analog Watches', "Analog watch (American) or analogue watch " +
                    "(UK & Commonwealth) is an example of a retronym. It was coined to distinguish " +
                    "analog watches, which had simply been called 'watches', from newer digital " +
                    "watches; see watch and clock. The name refers to the design of the display, " +
                    "regardless ofthe timekeeping technology used within the watch.",
                    categories[2], users[0], callback);
            },
            function(callback) {
                itemCreate('Sedan', "A sedan (American, Canadian, Australian, and New " +
                    "Zealand English) or saloon (British, Irish and Indian English) is a passenger " +
                    "car in a three-box configuration with A, B & C-pillars and principal volumes " +
                    "articulated in separate compartments for engine, passenger and cargo. The passenger " +
                    "compartment features two rows of seats and adequate passenger space in the rear " +
                    "compartment for adult passengers.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Truck', "A truck (or lorry) is a motor vehicle designed to " +
                    "transport cargo. Trucks vary greatly in size, power, and configuration; smaller " +
                    "varieties may be mechanically similar to some automobiles. Commercial trucks can " +
                    "be very large and powerful, and may be configured to mount specialized equipment, " +
                    "such as in the case of fire trucks and concrete mixers and suction " +
                    "excavators.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Sports Car', "An electric car is an automobile that is " +
                    "propelled by one or more electric motors, using electrical energy stored in " +
                    "rechargeable batteries. The first practical electric cars were produced in " +
                    "the 1880s.[1][2] Electric cars were popular in the late 19th century and early " +
                    "20th century, until advances in internal combustion engines, electric starters " +
                    "in particular, and mass production of cheaper gasoline vehicles led to a decline " +
                    "in the use of electric drive vehicles.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Sports Utility Vehicle', "A sport utility vehicle or suburban " +
                    "utility vehicle (SUV) is a vehicle classified as a light truck, but operated as " +
                    "a family vehicle. SUVs are similar to a large station wagon or estate car, though " +
                    "typically featuring tall interior packaging, high H-point seating, high center of " +
                    "gravity, high ground-clearance and especially four- or all-wheel-drive capability " +
                    "for on- or off-road ability. Some SUVs include the towing capacity of a " +
                    "pickup truck with the passenger-carrying space of a minivan or large " +
                    "sedan.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Coupe', "A coupe (/coo-pay/) (from the French past participle " +
                    "coupe, of the infinitive couper, to cut) is a car with a fixed-roof body style " +
                    "that is shorter than a sedan or saloon (British and Irish English) of the same " +
                    "model. The precise definition of the term varies between manufacturers and over " +
                    "time, but generally, a coupe will only seat two people and have two doors, " +
                    "though it may have rear seating and rear doors for additional passengers. " +
                    "The term was first applied to 19th-century carriages, where the rear-facing " +
                    "seats had been eliminated, or cut out.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Electric Car', "An electric car is an automobile that is " +
                    "propelled by one or more electric motors, using electrical energy stored in " +
                    "rechargeable batteries. The first practical electric cars were produced in the " +
                    "1880s. Electric cars were popular in the late 19th century and early 20th century, " +
                    "until advances in internal combustion engines, electric starters in particular, " +
                    "and mass production of cheaper gasoline vehicles led to a decline in the use " +
                    "of electric drive vehicles.",
                    categories[3], users[0], callback);
            },
            function(callback) {
                itemCreate('Supercomputer', "A supercomputer is a computer with a high " +
                    "level of computing performance compared to a general-purpose computer. " +
                    "Performance of a supercomputer is measured in floating-point operations " +
                    "per second (FLOPS) instead of million instructions per second (MIPS). " +
                    "As of 2015, there are supercomputers which can perform up to quadrillions " +
                    "of FLOPS, measured in P(eta)FLOPS. The majority of supercomputers today run " +
                    "Linux-based operating systems.",
                    categories[4], users[0], callback);
            },
            function(callback) {
                itemCreate('Minicomputers', "A minicomputer, or colloquially mini, " +
                    "is a class of smaller computers that was developed in the mid-1960s and " +
                    "sold for much less than mainframe and mid-size computers from IBM and its " +
                    "direct competitors. In a 1970 survey, the New York Times suggested a " +
                    "consensus definition of a minicomputer as a machine costing less than " +
                    "US$25,000, with an input-output device such as a teleprinter and at least " +
                    "four thousand words of memory, that is capable of running programs in a " +
                    "higher level language, such as Fortran or BASIC.",
                    categories[4], users[0], callback);
            },
            function(callback) {
                itemCreate('Microcomputers', "A microcomputer is a small, " +
                    "relatively inexpensive computer with a microprocessor as its central " +
                    "processing unit (CPU). It includes a microprocessor, memory, and minimal " +
                    "input/output (I/O) circuitry mounted on a single printed circuit board. " +
                    "Microcomputers became popular in the 1970s and 1980s with the advent of " +
                    "increasingly powerful microprocessors. The predecessors to these computers, " +
                    "mainframes and minicomputers, were comparatively much larger and more " +
                    "expensive (though indeed present-day mainframes such as the IBM System z " +
                    "machines use one or more custom microprocessors as their " +
                    "CPUs).",
                    categories[4], users[0], callback);
            },
            function(callback) {
                itemCreate('Mobile computers', "Mobile computing is human-computer " +
                    "interaction by which a computer is expected to be transported during normal " +
                    "usage, which allows for transmission of data, voice and video. Mobile computing " +
                    "involves mobile communication, mobile hardware, and mobile software. " +
                    "Communication issues include ad hoc networks and infrastructure networks as well " +
                    "as communication properties, protocols, data formats and concrete technologies. " +
                    "Hardware includes mobile devices or device components. Mobile software deals " +
                    "with the characteristics and requirements of mobile " +
                    "applications.",
                    categories[4], users[0], callback);
            },
            function(callback) {
                itemCreate('Mainframe', "Mainframe computers (colloquially referred to " +
                    "as 'big iron') are computers used primarily by large organizations for critical " +
                    "applications, bulk data processing, such as census, industry and consumer " +
                    "statistics, enterprise resource planning, and transaction processing. " +
                    "The term originally referred to the large cabinets called 'main frames' " +
                    "that housed the central processing unit and main memory of early computers. " +
                    "Later, the term was used to distinguish high-end commercial machines from " +
                    "less powerful units. Most large-scale computer system architectures were " +
                    "established in the 1960s, but continue to evolve.",
                    categories[4], users[0], callback);
            }
        ],
        //  Optional callback
        cb);
}

async.series([
        createUsers,
        createCategories,
        createItems
    ],
    // Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Items: ' + items);
        }
        // Done, disconnect from database.
        mongoose.connection.close();
    });