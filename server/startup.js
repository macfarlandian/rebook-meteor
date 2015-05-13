(function(){Meteor.startup(function(){
    // data fixtures for testing
    
    // LOTR fixture
    if (Books.find({name: "The Fellowship of the Ring"}).count() == 0) {
        var chapters = [
            "A Long-expected Party.txt",
            "The Shadow of the Past.txt",
            "Three is Company.txt",
            "A Short Cut to Mushrooms.txt"
        ];

        // create resources
        _.each(chapters, function(name){
            var text = {
                name: name,
                type: 'text/plain',
                contents: Assets.getText('data/lotr/'+name),
            };
            text.wordcount = (text.contents.split(/\s+/).length);
            Resources.insert(text);
        });

        // create chapters
        // include map coordinates
        var coords = [
            {lat: 36.80928470205937, lng: -62.22656249999999},
            {lat: 36.77409249464195, lng: -61.65527343749999},
            {lat: 34.052659421375964, lng: -58.22753906250001},
            {lat: 33.87041555094183, lng: -51.67968749999999}
        ];

        _.each(chapters, function(name, index){
            var text = Resources.findOne({name: name}),
                chap = {
                    name: name.split(/\.txt/)[0],
                    contents: [text]
                };
            
            chap.contents[0].start = 0;
            chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
            chap.contents[0].track = 0;
            chap.coords = coords[index];

            chap.wordcount = _.reduce(chap.contents, function(memo, current){
                return memo + current.wordcount;
            }, 0);
        
            Chapters.insert(chap);
        });

        // make the book
        var book = {
            name: "The Fellowship of the Ring",
            author: "J.R.R. Tolkein",
            mapEnabled: true,
            contents: []
        };
        _.each(chapters, function(file){
            var name = file.split(/\.txt/)[0];
            book.contents.push(Chapters.findOne({name: name}));
        });
        book.wordcount = _.reduce(book.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        
        Books.insert(book);
    }

    // Poe fixture
    // if (Books.find({name: "The Works of Edgar Allan Poe"}).count() == 0) {
    //     var chapters = [
    //         "Edgar Allan Poe: An Appreciation.txt",
    //         "Four Beasts In One—the Homo-cameleopard.txt",
    //         "Ms. Found In A Bottle.txt",
    //         "The Balloon-hoax.txt",
    //         "The Gold-bug.txt",
    //         "The Murders In The Rue Morgue.txt",
    //         'The Mystery Of Marie Roget. A Sequel To "the Murders In The Rue Morgue.".txt',
    //         "The Oval Portrait.txt",
    //         "The Unparalleled Adventures Of One Hans Pfaal.txt"
    //     ];
    //     // create resources
    //     _.each(chapters, function(name){
    //         var text = {
    //             name: name,
    //             type: 'text/plain',
    //             contents: Assets.getText('data/poe/'+name),
    //         };
    //         text.wordcount = (text.contents.split(/\s+/).length);
    //         Resources.insert(text);
    //     });
    //     // create chapters
    //     _.each(chapters, function(name){
    //         var text = Resources.findOne({name: name}),
    //             chap = {
    //                 name: name.split(/\.txt/)[0],
    //                 contents: [text]
    //             };
            
    //         chap.contents[0].start = 0;
    //         chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
    //         chap.contents[0].track = 0;

    //         chap.wordcount = _.reduce(chap.contents, function(memo, current){
    //             return memo + current.wordcount;
    //         }, 0);
        
    //         Chapters.insert(chap);
    //     });
    //     // create collection
    //     var coll = {
    //         type: "collection",
    //         name: "Stories",
    //         contents: []
    //     }
    //     _.each(chapters, function(name, i){
    //         if (i < 3) return;
    //         name = name.split(/\.txt/)[0];
    //         var chapter = Chapters.findOne({name: name});
    //         coll.contents.push(chapter)
    //     });
    //     coll.wordcount = _.reduce(coll.contents, function(memo, current){
    //         return memo + current.wordcount;
    //     }, 0);
    //     coll_id = Containers.insert(coll);
    //     // make the book
    //     var book = {
    //         name: "The Works of Edgar Allan Poe",
    //         author: "Edgar Allan Poe",
    //         contents: []
    //     };
    //     _.each(chapters, function(name, i){
    //         if (i > 2) return;
    //         name = name.split(/\.txt/)[0];
    //         var chapter = Chapters.findOne({name: name});
    //         book.contents.push(chapter)
    //     });
    //     book.contents.push(Containers.findOne(coll_id));
    //     book.wordcount = _.reduce(book.contents, function(memo, current){
    //         return memo + current.wordcount;
    //     }, 0);
    //     Books.insert(book);
    // }

    // a bunch of standard linear books
    var books = [
        {
            name: "Jane Eyre",
            author: 'Charlotte Brontë',
            dir: 'eyre',
            files: [
            "Chapter 1.txt",
            "Chapter 2.txt",
            "Chapter 3.txt",
            "Chapter 4.txt",
            "Chapter 5.txt",
            "Chapter 6.txt",
            "Chapter 7.txt",
            "Chapter 8.txt",
            "Chapter 9.txt",
            "Chapter 10.txt",
            "Chapter 11.txt",
            "Chapter 12.txt",
            "Chapter 13.txt",
            "Chapter 14.txt",
            "Chapter 15.txt",
            "Chapter 16.txt",
            "Chapter 17.txt",
            "Chapter 18.txt",
            "Chapter 19.txt",
            "Chapter 20.txt",
            "Chapter 21.txt",
            "Chapter 22.txt",
            "Chapter 23.txt",
            "Chapter 24.txt",
            "Chapter 25.txt",
            "Chapter 26.txt",
            "Chapter 27.txt",
            "Chapter 28.txt",
            "Chapter 29.txt",
            "Chapter 30.txt",
            "Chapter 31.txt",
            "Chapter 32.txt",
            "Chapter 33.txt",
            "Chapter 34.txt",
            "Chapter 35.txt",
            "Chapter 36.txt",
            "Chapter 37.txt",
            "Chapter 38.txt"
            ]
        },
        {
            name: "Frankenstein, or the Modern Prometheus",
            author: "Mary Wollstonecraft (Godwin) Shelley",
            dir: 'frankenstein',
            files: [
                "Letter 1.txt",
                "Letter 2.txt",
                "Letter 3.txt",
                "Letter 4.txt",
                "Chapter 1.txt",
                "Chapter 2.txt",
                "Chapter 3.txt",
                "Chapter 4.txt",
                "Chapter 5.txt",
                "Chapter 6.txt",
                "Chapter 7.txt",
                "Chapter 8.txt",
                "Chapter 9.txt",
                "Chapter 10.txt",
                "Chapter 11.txt",
                "Chapter 12.txt",
                "Chapter 13.txt",
                "Chapter 14.txt",
                "Chapter 15.txt",
                "Chapter 16.txt",
                "Chapter 17.txt",
                "Chapter 18.txt",
                "Chapter 19.txt",
                "Chapter 20.txt",
                "Chapter 21.txt",
                "Chapter 22.txt",
                "Chapter 23.txt",
                "Chapter 24.txt"
            ]
        },
        {
            name: "House of Mirth",
            author: "Edith Wharton",
            dir: 'mirth',
            files: [
                "Chapter 1.txt",
                "Chapter 2.txt",
                "Chapter 3.txt",
                "Chapter 4.txt",
                "Chapter 5.txt",
                "Chapter 6.txt",
                "Chapter 7.txt",
                "Chapter 8.txt",
                "Chapter 9.txt",
                "Chapter 10.txt",
                "Chapter 11.txt",
                "Chapter 12.txt",
                "Chapter 13.txt",
                "Chapter 14.txt",
                "Chapter 15.txt",
            ]
        },
        {
            name: "Moby-Dick, or The Whale",
            author: "Herman Melville",
            dir: "moby",
            files: [
                "CHAPTER 1. Loomings..txt",
                "CHAPTER 2. The Carpet-Bag..txt",
                "CHAPTER 3. The Spouter-Inn..txt",
                "CHAPTER 4. The Counterpane..txt",
                "CHAPTER 5. Breakfast..txt",
                "CHAPTER 6. The Street..txt",
                "CHAPTER 7. The Chapel..txt",
                "CHAPTER 8. The Pulpit..txt",
                "CHAPTER 9. The Sermon..txt",
                "CHAPTER 10. A Bosom Friend..txt",
                "CHAPTER 11. Nightgown..txt",
                "CHAPTER 12. Biographical..txt",
                "CHAPTER 13. Wheelbarrow..txt",
                "CHAPTER 14. Nantucket..txt",
                "CHAPTER 15. Chowder..txt",
                "CHAPTER 16. The Ship..txt",
                "CHAPTER 17. The Ramadan..txt",
                "CHAPTER 18. His Mark..txt",
                "CHAPTER 19. The Prophet..txt",
                "CHAPTER 20. All Astir..txt",
                "CHAPTER 21. Going Aboard..txt",
                "CHAPTER 22. Merry Christmas..txt",
                "CHAPTER 23. The Lee Shore..txt",
                "CHAPTER 24. The Advocate..txt",
                "CHAPTER 25. Postscript..txt",
                "CHAPTER 26. Knights and Squires..txt",
                "CHAPTER 27. Knights and Squires..txt",
                "CHAPTER 28. Ahab..txt",
                "CHAPTER 29. Enter Ahab; to Him, Stubb..txt",
                "CHAPTER 30. The Pipe..txt",
                "CHAPTER 31. Queen Mab..txt",
                "CHAPTER 32. Cetology..txt",
                "CHAPTER 33. The Specksnyder..txt",
                "CHAPTER 34. The Cabin-Table..txt",
                "CHAPTER 35. The Mast-Head..txt",
                "CHAPTER 36. The Quarter-Deck..txt",
                "CHAPTER 37. Sunset..txt",
                "CHAPTER 38. Dusk..txt",
                "CHAPTER 39. First Night Watch..txt",
                "CHAPTER 40. Midnight, Forecastle..txt",
                "CHAPTER 41. Moby Dick..txt",
                "CHAPTER 42. The Whiteness of The Whale..txt",
                "CHAPTER 43. Hark!.txt",
                "CHAPTER 44. The Chart..txt",
                "CHAPTER 45. The Affidavit..txt",
                "CHAPTER 46. Surmises..txt",
                "CHAPTER 47. The Mat-Maker..txt",
                "CHAPTER 48. The First Lowering..txt",
                "CHAPTER 49. The Hyena..txt",
                "CHAPTER 50. Ahab's Boat and Crew. Fedallah..txt",
                "CHAPTER 51. The Spirit-Spout..txt",
                "CHAPTER 52. The Albatross..txt",
                "CHAPTER 53. The Gam..txt",
                "CHAPTER 54. The Town-Ho's Story..txt",
                "CHAPTER 55. Of the Monstrous Pictures of Whales..txt",
                "CHAPTER 56. Of the Less Erroneous Pictures of Whales, and the True.txt",
                "CHAPTER 57. Of Whales in Paint; in Teeth; in Wood; in Sheet-Iron; in.txt",
                "CHAPTER 58. Brit..txt",
                "CHAPTER 59. Squid..txt",
                "CHAPTER 60. The Line..txt",
                "CHAPTER 61. Stubb Kills a Whale..txt",
                "CHAPTER 62. The Dart..txt",
                "CHAPTER 63. The Crotch..txt",
                "CHAPTER 64. Stubb's Supper..txt",
                "CHAPTER 65. The Whale as a Dish..txt",
                "CHAPTER 66. The Shark Massacre..txt",
                "CHAPTER 67. Cutting In..txt",
                "CHAPTER 68. The Blanket..txt",
                "CHAPTER 69. The Funeral..txt",
                "CHAPTER 70. The Sphynx..txt",
                "CHAPTER 71. The Jeroboam's Story..txt",
                "CHAPTER 72. The Monkey-Rope..txt",
                "CHAPTER 73. Stubb and Flask Kill a Right Whale; and Then Have a Talk.txt",
                "CHAPTER 74. The Sperm Whale's Head--Contrasted View..txt",
                "CHAPTER 75. The Right Whale's Head--Contrasted View..txt",
                "CHAPTER 76. The Battering-Ram..txt",
                "CHAPTER 77. The Great Heidelburgh Tun..txt",
                "CHAPTER 78. Cistern and Buckets..txt",
                "CHAPTER 79. The Prairie..txt",
                "CHAPTER 80. The Nut..txt",
                "CHAPTER 81. The Pequod Meets The Virgin..txt",
                "CHAPTER 82. The Honour and Glory of Whaling..txt",
                "CHAPTER 83. Jonah Historically Regarded..txt",
                "CHAPTER 84. Pitchpoling..txt",
                "CHAPTER 85. The Fountain..txt",
                "CHAPTER 86. The Tail..txt",
                "CHAPTER 87. The Grand Armada..txt",
                "CHAPTER 88. Schools and Schoolmasters..txt",
                "CHAPTER 89. Fast-Fish and Loose-Fish..txt",
                "CHAPTER 90. Heads or Tails..txt",
                "CHAPTER 91. The Pequod Meets The Rose-Bud..txt",
                "CHAPTER 92. Ambergris..txt",
                "CHAPTER 93. The Castaway..txt",
                "CHAPTER 94. A Squeeze of the Hand..txt",
                "CHAPTER 95. The Cassock..txt",
                "CHAPTER 96. The Try-Works..txt",
                "CHAPTER 97. The Lamp..txt",
                "CHAPTER 98. Stowing Down and Clearing Up..txt",
                "CHAPTER 99. The Doubloon..txt",
                "CHAPTER 100. Leg and Arm..txt",
                "CHAPTER 101. The Decanter..txt",
                "CHAPTER 102. A Bower in the Arsacides..txt",
                "CHAPTER 103. Measurement of The Whale's Skeleton..txt",
                "CHAPTER 104. The Fossil Whale..txt",
                "CHAPTER 105. Does the Whale's Magnitude Diminish?--Will He Perish?.txt",
                "CHAPTER 106. Ahab's Leg..txt",
                "CHAPTER 107. The Carpenter..txt",
                "CHAPTER 108. Ahab and the Carpenter..txt",
                "CHAPTER 109. Ahab and Starbuck in the Cabin..txt",
                "CHAPTER 110. Queequeg in His Coffin..txt",
                "CHAPTER 111. The Pacific..txt",
                "CHAPTER 112. The Blacksmith..txt",
                "CHAPTER 113. The Forge..txt",
                "CHAPTER 114. The Gilder..txt",
                "CHAPTER 115. The Pequod Meets The Bachelor..txt",
                "CHAPTER 116. The Dying Whale..txt",
                "CHAPTER 117. The Whale Watch..txt",
                "CHAPTER 118. The Quadrant..txt",
                "CHAPTER 119. The Candles..txt",
                "CHAPTER 120. The Deck Towards the End of the First Night Watch..txt",
                "CHAPTER 121. Midnight.--The Forecastle Bulwarks..txt",
                "CHAPTER 122. Midnight Aloft.--Thunder and Lightning..txt",
                "CHAPTER 123. The Musket..txt",
                "CHAPTER 124. The Needle..txt",
                "CHAPTER 125. The Log and Line..txt",
                "CHAPTER 126. The Life-Buoy..txt",
                "CHAPTER 127. The Deck..txt",
                "CHAPTER 128. The Pequod Meets The Rachel..txt",
                "CHAPTER 129. The Cabin..txt",
                "CHAPTER 130. The Hat..txt",
                "CHAPTER 131. The Pequod Meets The Delight..txt",
                "CHAPTER 132. The Symphony..txt",
                "CHAPTER 133. The Chase--First Day..txt",
                "CHAPTER 134. The Chase--Second Day..txt",
                "CHAPTER 135. The Chase.--Third Day..txt",
                "Epilogue.txt",
            ]
        },
        {
            name: "Call of the Wild",
            author: "Jack London",
            dir: "wild",
            files: [
                "Chapter I. Into the Primitive.txt",
                "Chapter II. The Law of Club and Fang.txt",
                "Chapter III. The Dominant Primordial Beast.txt",
                "Chapter IV. Who Has Won to Mastership.txt",
                "Chapter V. The Toil of Trace and Trail.txt",
                "Chapter VI. For the Love of a Man.txt",
                "Chapter VII. The Sounding of the Call.txt",
                ]
        },
        {
            name: "Wuthering Heights",
            author: "Emily Brontë",
            dir: "wuthering",
            files: [
                "CHAPTER I.txt",
                "CHAPTER II.txt",
                "CHAPTER III.txt",
                "CHAPTER IV.txt",
                "CHAPTER V.txt",
                "CHAPTER VI.txt",
                "CHAPTER VII.txt",
                "CHAPTER VIII.txt",
                "CHAPTER IX.txt",
                "CHAPTER X.txt",
                "CHAPTER XI.txt",
                "CHAPTER XII.txt",
                "CHAPTER XIII.txt",
                "CHAPTER XIV.txt",
                "CHAPTER XV.txt",
                "CHAPTER XVI.txt",
                "CHAPTER XVII.txt",
                "CHAPTER XVIII.txt",
                "CHAPTER XIX.txt",
                "CHAPTER XX.txt",
                "CHAPTER XXI.txt",
                "CHAPTER XXII.txt",
                "CHAPTER XXIII.txt",
                "CHAPTER XXIV.txt",
                "CHAPTER XXV.txt",
                "CHAPTER XXVI.txt",
                "CHAPTER XXVII.txt",
                "CHAPTER XXVIII.txt",
                "CHAPTER XXIX.txt",
                "CHAPTER XXX.txt",
                "CHAPTER XXXI.txt",
                "CHAPTER XXXII.txt",
                "CHAPTER XXXIII.txt",
                "CHAPTER XXXIV.txt",
            ]
        }
    ];
    _.each(books, function(book){
        if (Books.find({name: book.name}).count() != 0) return;

        // create resources and save ids for retrieval
        var res_ids = []
        _.each(book.files, function(name){
            var text = {
                name: name,
                type: 'text/markdown',
                contents: Assets.getText('data/' + book.dir + '/'+name),
            };
            text.wordcount = (text.contents.split(/\s+/).length);
            var res_id = Resources.insert(text);
            res_ids.push(res_id);
        });
        // create chapters and save ids
        var chap_ids = [];
        _.each(book.files, function(name){
            var text = Resources.findOne({name: name, _id: {$in: res_ids}}),
                chap = {
                    name: name.split(/\.txt/)[0],
                    contents: [text]
                };
            
            chap.contents[0].start = 0;
            chap.contents[0].end = chap.contents[0].start + chap.contents[0].wordcount ;
            chap.contents[0].track = 0;

            chap.wordcount = _.reduce(chap.contents, function(memo, current){
                return memo + current.wordcount;
            }, 0);
        
            var chap_id = Chapters.insert(chap);
            chap_ids.push(chap_id);
        });
        // make the book
        var newbook = {
            name: book.name,
            author: book.author,
            contents: []
        };
        _.each(book.files, function(name, i){
            name = name.split(/\.txt/)[0];
            var chapter = Chapters.findOne({name: name, _id: {$in: chap_ids}});
            newbook.contents.push(chapter)
        });
        newbook.wordcount = _.reduce(newbook.contents, function(memo, current){
            return memo + current.wordcount;
        }, 0);
        Books.insert(newbook);
    })

})

})();
