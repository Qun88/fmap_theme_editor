
//#region Var

'use strict';

/* var config.mapId = '10347';
var themeId = '2001';
var appkey = '57c7f309aca507497d028a9c00207cf8';
var appname = '蜂鸟研发SDK_2_0'; */

var map;
var marker;
var selector;
var testCount;
var containerId = 'map';
var lazyCreateMode = true;
var mapIsOk = false;
var last_angel = null;
var last_tilt;
var groupControl;
var navi;
var locationMarker;


//导航拾取标记 0：不拾取坐标|1：拾取起点|2：拾取终点
var pickFlag = 0;

window.onload = function () {
    init();
    document.title = '测试工具 v' + fengmap.VERSION;
}

var cfg = {
    rotate: 300,
    scale: 0.03218871928681973,
    floor: 1,
    center: { x: 13381126.515, y: 3541082.545, groupID: this.floor, callback: function () { map.scaleLevelValue = this.scale } }
}

var _rotaterTimer;
//#endregion

//#region Map operations

function setModelsColor(color, alpha) {
    var searchType = fengmap.FMNodeType.MODEL;

    var request = {
        nodeType: searchType
    };

    fengmap.MapUtil.search(map, map.focusGroupID, request, function (result) {
        var models = result;
        if (models.length <= 0) return;

        for (let index = 0; index < models.length; index++) {
            var model = models[index];
            model.setColor(color, alpha);
        }
    });
}

function rotate(duration) {
    _rotaterTimer = setInterval(function () {
        map.rotateAngle = map.rotateAngle + 1;
        if (map.mapScale >= 600) {
            map.mapScale = map.mapScale - 50;
        }
    }, duration)
}

function stopRotate() {
    clearInterval(_rotaterTimer);
}

function loadMapStatus() {
    if (map) {
        map.rotateAngle = cfg.rotate;
        map.focusGroupID = cfg.floor;
        map.moveTo(cfg.center);
        map.visibleGroupIDs = [1];
    }
}

function initNavi() {
    navi = new fengmap.FMNavigation({
        map: map,
        locationMarkerUrl: 'c.png',
        locationMarkerSize: 43,
        followAngle: true,
        tiltAngle: 80,
        scaleLevel: 0,
        lineStyle: {
            lineType: fengmap.FMLineType.FMARROW,
            lineWidth: 6,
        }
    });
}

function hideModel(modelName) {
    var searchType = fengmap.FMNodeType.FMElement;

    var request = {
        nodeType: searchType
    };

    fengmap.MapUtil.search(map, 'all', request, function (result) {
        var models = result;
        if (models.length <= 0) return;

        for (let index = 0; index < models.length; index++) {
            var model = models[index];
            if (model.nodeType == 100 && model.name == modelName) {
                model.visible = false;
            }
        }
    });
}

function showModel(modelName) {
    var searchType = fengmap.FMNodeType.FMElement;

    var request = {
        nodeType: searchType
    };

    fengmap.MapUtil.search(map, 'all', request, function (result) {
        var models = result;
        if (models.length <= 0) return;

        for (let index = 0; index < models.length; index++) {
            var model = models[index];
            if (model.nodeType == 100 && model.name == modelName) {
                model.visible = true;
            }
        }
    });
}

function hideLayers(LayerIds, group) {
    var layers = map.getFMGroup(group).layers;

    for (let index = 0; index < LayerIds.length; index++) {
        var layerId = LayerIds[index];
        layers[layerId].visible = false;
    }

    return layers;
}

function showLayers(LayerIds, group) {
    var layers = map.getFMGroup(group).layers;

    for (let index = 0; index < LayerIds.length; index++) {
        var layerId = LayerIds[index];
        layers[layerId].visible = true;
    }

    return layers;
}
//#endregion

//#region Layers

function getCurrentGroupLayers() {
    if (map) {
        var layers = map.getFMGroup(map.focusGroupID).layers;

        var extentLayer, storeModelLayer, labelLayer, facilityLayer, externalModelLayer;
        var _layers = [];

        for (let index = 0; index < layers.length; index++) {
            const layer = layers[index];

            if (layer instanceof fengmap.FMExtentLayer) {
                _layers.push({ layerType: '地板图层', vIndex: index });
                continue;
            } else if (layer instanceof fengmap.FMModelLayer) {
                _layers.push({ layerType: '矢量面图层', vIndex: index });
                continue;
            } else if (layer instanceof fengmap.FMExternalModelLayer) {
                _layers.push({ layerType: '外部模型图层', vIndex: index });
                continue;
            } else if (layer instanceof fengmap.FMLabelLayer) {
                _layers.push({ layerType: '标注图层', vIndex: index });
                continue;
            } else if (layer instanceof fengmap.FMFacilityLayer) {
                _layers.push({ layerType: '图标图层', vIndex: index });
                continue;
            } else {
                _layers.push({ layerType: '其他图层', vIndex: index });
                continue;
            }
        }

        return _layers;
    }

    return null;
}

function fillDataToLayerList() {
    var _layers = getCurrentGroupLayers();
    console.log(_layers);
    var domLayerList = document.getElementById('layerList');
    var domSelect = document.createElement('select');
    domSelect.setAttribute('id', 'selectLayerList');
    domSelect.addEventListener('change', function () {
        var layerId = this.options[this.options.selectedIndex].value;
    });
    for (let index = 0; index < _layers.length; index++) {
        var domOption = document.createElement('option');
        domOption.setAttribute('value', _layers[index].vIndex);
        domOption.innerText = _layers[index].layerType;

        domSelect.appendChild(domOption);
    }
    domLayerList.appendChild(domSelect);
    var domBtnHideLayer = document.createElement('input');
    domBtnHideLayer.addEventListener('click', function () {
        var select = document.getElementById('selectLayerList');
        var layerIndex = select.options[select.options.selectedIndex].value;
        hideLayers([layerIndex], map.focusGroupID);
    });
    domBtnHideLayer.setAttribute('type', 'button');
    domBtnHideLayer.setAttribute('value', '隐藏图层');
    var domBtnShowLayer = document.createElement('input');
    domBtnShowLayer.addEventListener('click', function () {
        var select = document.getElementById('selectLayerList');
        var layerIndex = select.options[select.options.selectedIndex].value;
        showLayers([layerIndex], map.focusGroupID);
    });
    domBtnShowLayer.setAttribute('type', 'button');
    domBtnShowLayer.setAttribute('value', '显示图层');
    domLayerList.appendChild(domBtnHideLayer);
    domLayerList.appendChild(domBtnShowLayer);
}

function getNodeTypeById(id) {
    switch (id) {
        case fengmap.FMNodeType.ELEMENT:
            return "ELEMENT";
            break;
        case fengmap.FMNodeType.FACILITY:
            return "FACILITY";
            break;
        case fengmap.FMNodeType.FLOOR:
            return "FLOOR";
            break;
        case fengmap.FMNodeType.IMAGE_MARKER:
            return "IMAGE_MARKER";
            break;
        case fengmap.FMNodeType.LABEL:
            return "LABEL";
            break;
        case fengmap.FMNodeType.LINE:
            return "LINE";
            break;
        case fengmap.FMNodeType.LOCATION_MARKER:
            return "LOCATION_MARKER";
            break;
        case fengmap.FMNodeType.MODEL:
            return "MODEL";
            break;
        case fengmap.FMNodeType.NONE:
            return "NONE";
            break;
        case fengmap.FMNodeType.TEXT_MARKER:
            return "TEXT_MARKER";
            break;
        default:
            return "NONE";
            break;
    }
}

//#endregion

//#region Init
function init() {
    if (map) {
        console.log('map has been added.');


        return;
    }

    var ctlOpt = new fengmap.controlOptions({
        //默认在右上角
        position: fengmap.controlPositon.RIGHT_TOP,
        //默认显示楼层的个数
        showBtnCount: 7,
        //初始是否是多层显示，默认单层显示
        allLayer: false,
        //位置x,y的偏移量
        offset: {
            x: 20,
            y: 10
        }
    });

    map = new fengmap.FMMap({
        container: document.getElementById(containerId),
        mapServerURL: './data/' + config.mapId,
        mapThemeURL: './data/theme/' + config.mapId,
        defaultThemeName: config.themeId,
        //defaultVisibleGroups: [1],
        //defaultFocusGroup: 1,
        key: config.appkey,
        appName: config.appname,
        //defaultMapScaleLevel: 20,
        defaultViewMode: '3d',
        focusAlphaMode: true,
        focusAnimateMode: false,
        focusAlpha: 0.1,
        rotateAngle: 300,
        tiltAngle: 30,
        //frameRate: 60,
        //defaultGroupSpace: 35,
        lazyCreateMode: config.lazyCreateMode,
        modelSelectedEffect: false
    });


    map.openMapById(config.mapId, function (error) {
        console.log(error);
    });

    map.on('loadComplete', function () {
        mapIsOk = true;
        groupControl = new fengmap.scrollGroupsControl(map, ctlOpt);
        fillDataToLayerList();
        console.log('Map loadComplete!');
    });

    map.on('mapClickNode', function (event) {

        console.log(event);
        var infoWindow = document.getElementById('info');
        infoWindow.innerText = '';

        if (!event.data_) {
            infoWindow.innerText += 'NodeType:' + getNodeTypeById(event.nodeType);
        } else {
            if (!event.data_.theme_) {
                infoWindow.innerText += 'NodeType:' + getNodeTypeById(event.nodeType) + '\n' +
                    'Name:' + event.data_.name + '\n' +
                    'EName:' + event.data_.eName + '\n' +
                    'TypeId:' + event.data_.type + '\n';
            } else {
                infoWindow.innerText += 'NodeType:' + getNodeTypeById(event.nodeType) + '\n' +
                    'FID:' + event.FID + '\n' +
                    'Name:' + event.name + '\n' +
                    'EName:' + event.eName + '\n' +
                    'TypeId:' + event.typeID + '\n' + 'Theme:' + JSON.stringify(event.data_.theme_);
            }
        }

        /* if (1 === 1) {
            var infoWindow = document.getElementById('info');
            infoWindow.innerText = '';
            infoWindow.innerText = 'Layer Type:' + event.nodeType + '\n' +
                'FID:' + event.FID + '\n' +
                'Name:' + event.name + '\n' +
                'EName:' + event.eName + '\n' +
                'TypeId:' + event.typeID + '\n' +
                'Theme:' + JSON.stringify(event.data_.theme_);

            alert('Layer Type:' + 'FMStoreModel' + '\n' +
                'FID:' + event.FID + '\n' +
                'Name:' + event.name + '\n' +
                'EName:' + event.eName + '\n' +
                'TypeId:' + event.typeID + '\n' +
                'Theme' + JSON.stringify(event.data_.theme_));
        } */

        var x = event.eventInfo.coord.x;
        var y = event.eventInfo.coord.y;
        var domStart = document.getElementById('txtStart');
        var domDest = document.getElementById('txtDestination');

        if (pickFlag > 0 && event.target == null) {
            alert('场景外坐标！');
            return;
        }

        if (pickFlag == 1) {
            domStart.value = x + ',' + y + ',' + event.groupID;
        } else if (pickFlag == 2) {
            domDest.value = x + ',' + y + ',' + event.groupID;
        }



        /* if (domStart.value !== "" && domDest.value !== "" && pickFlag > 0) {
            var strStart = domStart.value.split(',');
            var startPoint = { x: Number(strStart[0]), y: Number(strStart[1]), groupID: Number(strStart[2]) };
            var strDest = domDest.value.split(',');
            var destPoint = { x: Number(strDest[0]), y: Number(strDest[1]), groupID: Number(strDest[2]) };
            if (mapIsOk == false) {
                alert('地图没有准备好');
                return;
            }
            if (navi == null) {
                initNavi();
            }

            navi.clearAll();
            navi.setStartPoint(startPoint);
            navi.setEndPoint(destPoint);

            navi.drawNaviLine();
            fillNaviDataToDom(navi.naviDescriptions);
        } */

        //#region BBA test code.

        console.log(event);
        if (event._type_ == 'externalModel' && event.FID != "4339810104195") {
            event.flash();
        }
        else if (event.nodeType == 5) {

        }

        //#endregion

        pickFlag = 0;
    });


    function fillNaviDataToDom(data) {
        var oldResult = document.getElementById('resultData');
        if (oldResult) {
            oldResult.parentNode.removeChild(oldResult);
        }
        var domRoute = document.getElementById('ulRoute');
        var domResault = document.createElement('ul');
        domResault.setAttribute('id', 'resultData');
        for (let index = 0; index < data.length; index++) {
            const naviSegment = data[index];
            var domResaultSegment = document.createElement('li');
            if (index == 0) {
                domResaultSegment.innerText = '从起点出发，' + naviSegment;
            } else
                domResaultSegment.innerText = naviSegment;
            domResault.appendChild(domResaultSegment);
        }
        domRoute.appendChild(domResault);
    }

    //#region 

    //这个事件会在地图完全加载之前被执行
    map.on('focusGroupIDChanged', function (event) {

    });


    map.on('scaleLevelChanged', function (event) {

    });

    map.on('mapScaleLevelChanged', function (event) {
        /* 
                if (mapIsOk == true && map.mapScale > 200) {
                    hideModel('Desk');
                    hideModel('Chair');
                    hideModel('Meeting Table');
                } else if (mapIsOk == true && map.mapScale <= 200) {
                    showModel('Desk');
                    showModel('Chair');
                    showModel('Meeting Table');
                } */
    });

    //#endregion
}
//#endregion
