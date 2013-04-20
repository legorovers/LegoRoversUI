YUI().use('node', 'dd-constrain', 'dd-proxy', 'dd-drop', 'dd-scroll', function(Y) {
    //Listen for all drop:over events
    //Y.DD.DDM._debugShim = true;

    //Listen for all drag:drag events
    Y.DD.DDM.on('drag:drag', function(e) {
        //Get the last y point
        var y = e.target.lastXY[1];
        //is it greater than the lastY var?
        if (y < lastY) {
            //We are going up
            goingUp = true;
        } else {
            //We are going down.
            goingUp = false;
        }
        //Cache for next check
        lastY = y;
        Y.DD.DDM.syncActiveShims(true);
    });
    //Listen for all drag:start events
    Y.DD.DDM.on('drag:start', function(e) {
        //Get our drag object
        var drag = e.target;
        //Set some styles here
        drag.get('node').setStyle('opacity', '1');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '0.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
    //Listen for a drag:end events
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        //Put our styles back
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
    //Listen for all drag:drophit events
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        //if we are not on an li, we must have been dropped on a ul
        var lastChild = drop.get('children').slice(-1).item(0);
        var canAddEvent = true;

        if (lastChild !== null) {
            canAddEvent = lastChild.hasClass("event-item");
        }

        if (drop.hasClass('command-items') === true && canAddEvent || drag.hasClass("action-item")) {
            if (! (lastChild === null && drag.hasClass("action-item"))) {
                if (!drop.contains(drag)) {
                    drop.appendChild(drag.cloneNode(true));
                    //console.log();
                    //Set the new parentScroll on the nodescroll plugin
                    e.drag.nodescroll.set('parentScroll', e.drop.get('node'));
                }
            }
        }
    });

    //Static Vars
    var goingUp = false, lastY = 0;

    //Get the list of li's in the lists and make them draggable
    var lis = Y.all('#interface ul li');
    lis.each(function(v, k) {
        var dd = new Y.DD.Drag({
            node: v,
            target: {
                padding: '0 0 0 20'
            }
        }).plug(Y.Plugin.DDProxy, {
                moveOnEnd: false
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: '#interface'
            }).plug(Y.Plugin.DDNodeScroll, {
                node: v.get('parentNode')
            });
    });

    //Create simple targets for the 2 lists.
    var uls = Y.all('#interface ul');
    uls.each(function(v, k) {
        var tar = new Y.DD.Drop({
            node: v
        });
    });


});
