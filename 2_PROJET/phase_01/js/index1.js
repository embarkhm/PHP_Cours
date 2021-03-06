var data = {};
function hideCredits() {
    document.getElementById('credit').style.display = "none";
}
function showCredits() {
    document.getElementById('credit').style.display = "block";
}
function logoClickable() {
    document.getElementById("logo").setAttribute('onclick', "newAjaxJSON(this); return false;");
    document.getElementById("logo").dataset.url = "formLogo.html";
    document.getElementById("logo").title = "Changement de logo";
}

function focusOnAccueil() {
    document.querySelector('a[href="index.html"]').focus();
}

function createTableOrderByTitle(json) {
    console.log("json tableau = " + json);
    if (json[0] == '"') {
        json=JSON.parse(json);
    }
    var data = JSON.parse(json);
    console.log(data);
    var keys = Object.keys(data);
    //console.log(keys)
    var jsonKeys = Object.keys(data[keys[0]]);
    //console.log("fbhesgfus");
    //console.log(keys);
    //console.log(jsonKeys);
    //console.log(jsonKeys);
    //var sortedKeys = keys.sort(function sortTitles(x, y) {
       // if (data[x].titre > data[y].titre) return 1;
        //else if (data[x].titre < data[y].titre) return -1;
        //else return 0;
    //});
    if (keys[0] == 'creeTableau') {
        var bookList;
        bookList = "<table id='books'><thead>";
        bookList += "<th>" + "ref" + "</th>";
        for (var i in jsonKeys) {
            bookList += "<th>" + jsonKeys[i] + "</th>";
            //console.log(jsonKeys[i]);
        }
        bookList += "</thead>";
        bookList += "<tbody>";
        for (var i in keys) {
            bookList += "<tr>";
            bookList += "<td>" + keys[i] + "</td>";
            for (var j in jsonKeys) {
                bookList += "<td>" + data[keys[i]][jsonKeys[j]] + "</td>";
                //console.log(data[keys[i]][jsonKeys[j]]);
                //bookList += "<td>" + data[keys[i]].titre + "</td>";
                //bookList += "<td>" + data[keys[i]].prix + "</td>";
            }
            bookList += "</tr>";
        }
        bookList += "</tbody>";
        bookList += "</table>";
        return bookList;
    }
    else if (keys[0] == 'contenu') {
        document.getElementById('contenu').innerHTML = data['contenu'];
    }
    else {
        var bookList;
        bookList = "<table id='books'><thead>";
        bookList += "<th>" + "ref" + "</th>";
        for (var i in jsonKeys) {
            bookList += "<th>" + jsonKeys[i] + "</th>";
            //console.log(jsonKeys[i]);
        }
        bookList += "</thead>";
        bookList += "<tbody>";
        for (var i in keys) {
            bookList += "<tr>";
            bookList += "<td>" + keys[i] + "</td>";
            for (var j in jsonKeys) {
                bookList += "<td>" + data[keys[i]][jsonKeys[j]] + "</td>";
                //console.log(data[keys[i]][jsonKeys[j]]);
                //bookList += "<td>" + data[keys[i]].titre + "</td>";
                //bookList += "<td>" + data[keys[i]].prix + "</td>";
            }
            bookList += "</tr>";
        }
        bookList += "</tbody>";
        bookList += "</table>";
        return bookList;
    }
}

function filtre(f) {
    var script = document.getElementById('monScript');
    var radios = document.getElementsByName('group');
    var inputLowerCase = f.rechGroup.value.toLowerCase();
    var filtres = {
        debut:function(substr,inputLowerCase) { return substr.nom.toLowerCase().indexOf(inputLowerCase) == 0; },
        dedant:function(substr,inputLowerCase) { return substr.nom.toLowerCase().indexOf(inputLowerCase) > -1; },
        fin:function(substr,inputLowerCase) { var p = (substr.nom.toLowerCase().lastIndexOf(inputLowerCase))
                                                return (p > -1) && (p >= substr.nom.length-inputLowerCase.length) }
    };
    var selectedRadio;
    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            selectedRadio = radios[i].value;
        }
    }
    var listeTab = Object.keys(data['listeGroupes']).map(function (key) { return data['listeGroupes'][key]; }).filter(function (substr) { return filtres[selectedRadio](substr, inputLowerCase) })
                                    .map(function (col) { return col.nom });

    var liste = listeTab.join(', ');
    //console.log(listeTab);
    //document.getElementById('visu').innerHTML = liste;

    document.getElementById('selectGroup').innerHTML = '';
    //console.log(listeTab);
    if(listeTab.length == 0) {
        document.getElementById('selectGroup').setAttribute('size', '1');
        document.getElementById('selectGroup').innerHTML = "<option value='empty'>Pas de suggestion</option>";
    }
    for(var i in listeTab) {
        document.getElementById('selectGroup').innerHTML += "<option value=''" + listeTab[i] + "'>" + listeTab[i] + "</option>";
    }
}

function monChoix(s) {
    s.dataset.groupe=s.options[s.selectedIndex].text;
    //console.log(s.dataset.url);
    var dataJSON = "data : {'url':'" + s.dataset.url + "', 'dest':'" + s.dataset.dest + "', 'groupe':'" + s.dataset.groupe + "'}";
    //console.log(dataJSON);
    //alert(dataJSON);
    newAjaxJSON(s);
}

function gereRetour(json){
    console.log("JSON = " + json);
    if (json[0]=='"') {
        json = JSON.parse(json);
    }
    var retour = JSON.parse(json);
    console.log(retour);
    var action = Object.keys(retour);
    //console.log(action);
    for(var i in action) {
        console.log(action[i]);
        switch (action[i]) {
            case 'creeTableau':
                //console.log(retour);
                var dataa = retour.creeTableau;
                console.log(dataa);
                document.getElementById(dataa.destination).innerHTML = createTableOrderByTitle(JSON.stringify(dataa.tableau));
                break;
            case 'contenu':
                //console.log("LOOG = " + retour['contenu']);
                var sub = retour['contenu'].substr(0,5);
                if(sub == "Array") {
                    document.getElementById('contenu').innerHTML = "<pre>" + retour['contenu'] + "</pre>";
                }
                else {
                    document.getElementById('contenu').innerHTML = retour['contenu'];
                }
                break;
            case 'PDOException':
            case 'erreur':
                console.log(retour['PDOException']);
                document.getElementById('contenu').innerHTML = retour['PDOException'];
                if (document.getElementById('contenu').innerHTML == "[object Object]") {
                    document.getElementById('contenu').innerHTML = retour['PDOException']['PDOException'];
                }
                //console.log(retour['contenu']);
                /*console.log("errororroorro");
                document.getElementById('contenu').innerHTML = "<pre>" + retour['contenu'] + "</pre>";*/
                break;
            case 'chgTitle':
                document.getElementById('siteTitle').innerHTML = retour['chgTitle'];
                break;
            case 'modifCfg':
                console.log(retour['modifCfg']);
                //document.getElementById('resCfgMsg').i
                break;
            case 'chglogo':
                getElem("logo").src = retour['chglogo'] + '?' + (new Date()).getTime();
                break;
            case 'changeLogo':
                //console.log(retour);
                document.getElementById("logo").src = retour.changeLogo.changeLogo + '?' + (new Date()).getTime(); //pour changer l'image sant recharger la page
                break;
            case 'fond':
                //document.querySelector("logo").style.border = '0.3em solid'+ retour['fond'];
                document.querySelector("body").style.backgroundColor = retour['fond'];
                break;
            case 'listeGroupes':
                //console.log(JSON.parse(retour.listeGroupes));
                //data['listeGroupes']=Object.values(JSON.parse(retour.listeGroupes));
                //data['lastGroupSelected']=null;
                //console.log(retour.listeGroupes);
                data['listeGroupes'] = JSON.parse(retour.listeGroupes);
                //console.log(data['listeGroupes']);
                var arrayListeGroupes = Object.keys(data['listeGroupes']).map(function (key) { return data['listeGroupes'][key]; });
                //console.log(arrayListeGroupes);
                var listeTab = arrayListeGroupes.map(function (col) { return col.nom });
                //console.log(listeTab);
                //var listeTabId = data['listeGroupes'].map(function (col) { return col.nom });
                document.getElementById('selectGroup').innerHTML = '';
                for(var i in listeTab) {
                    document.getElementById('selectGroup').innerHTML += "<option value=''" + listeTab[i] + "'>" + listeTab[i] + "</option>";
                }

                //filtre(form04.groupe);
                break;
            default :
                console.log('Erreur');
        }
    }
    //getElem("p").innerHTML = createTable(json);
}

function newAjaxJSON(ref) {
    if (ref.action) { ref.dataset.url = ref.attributes.action.value; }
    if (ref.href) { ref.dataset.url = ref.attributes.href.value; }
    //console.log("PAS dans le if");
    console.log(ref);
    var lien = ref.dataset.url;
    console.log(ref);
    //console.log(lien);
    var nom = lien.split('.')[0];
    //console.log(nom);
    var input = ref.dataset;
    //console.log(input);
    delete input.url;
    input = Object.keys(input).map(function(x) {                        //on prend les cles (noms des champs) et on itere pour chaqune des cle
        return x+'='+input[x];                                          //on y join les valauers
    }).join('&');                                                       //on lie tous les morceaux avec le bon charactere

    var xhr = new XMLHttpRequest();
    xhr.open('POST', "index.php?rq="+nom+"&"+input, true);
    if (ref.action) { xhr.send(new FormData(ref)); }
    else { xhr.send(new FormData()); }
    //xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            //console.log(this);
            gereRetour(this.responseText);
        }
    };
    //return false;
}

function sendForm(ref) {
    newAjaxJSON(ref);
}