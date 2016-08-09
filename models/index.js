var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});
var Promise = require('bluebird');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING, 
        allowNull: false,
        isUrl: true,
    },
    content: {
        type: Sequelize.TEXT, 
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING) 
    }
},
    { getterMethods: {
        route: function() {
            return '/wiki/' + this.getDataValue('urlTitle');
        }
    },
     hooks: {
         beforeValidate: function(user, options){
             user.urlTitle = makeUrlTitle(user.title);
         }
     }
});

Page.findByTags = function(tags) {
    return Page.find({
    // $overlap matches a set of possibilities
    where : {
        tags: {
            $overlap: tags.split(' ')
        }
    }    
});
}

var User = db.define('user', {
    name: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true
    }
});

Page.belongsTo(User, { as: 'author'});

var syncAll = function() {
    return Promise.all([
        Page.sync({force: true}),
        User.sync({force: true})
    ]);
}

var makeUrlTitle = function(title) {
    var url;
    if(title) url = title.replace(/\W+/g, '_');
    else url = Math.random().toString(36).substring(2, 7);
    return url;
}

module.exports = {
  Page: Page,
  User: User,
  syncAll: syncAll                     
};