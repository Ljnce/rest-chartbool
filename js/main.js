
//--------> TROVO IL MIO URL DI BASE<---------
var baseUrl = 'http://157.230.17.132:4014/sales';
stampaGrafici();

//---------> CICLO AJAX 'GET' DEL MIO LINK <---------
function stampaGrafici(){
    $.ajax({
        url: baseUrl,
        method: 'GET',
        success: function(data){
            costruttoreData(data);
        },
        error: function(){
            alert('errore');
        }
    });
};

//-------> ESTRAPOLO I CONTENUTI CHE MI SERVONO DALL'AJAX (GET) <----------
function costruttoreData(data){
    //Creo le mie 2 variabili vuote che poi andrò a riempire

    var meseSomma = {
        'gennaio': 0,
        'febbraio': 0,
        'marzo': 0,
        'aprile': 0,
        'maggio': 0,
        'giugno': 0,
        'luglio': 0,
        'agosto': 0,
        'settembre': 0,
        'ottobre': 0,
        'novembre': 0,
        'dicembre': 0
    }; //Prendo i valori in ordine e ci aggiungo i risultati corrispondenti

    var venditeVenditore = {}; //Valore vuoto per i venditori

    var quarter = quarterData(data); //Mi faccio tornare i valori giusti sulla mia variabile quarter
    graficoQuarter(quarter); //Richiamo la varibile quarter con i miei valori, per poi ciclarla in for in

    var polar = polarData(data);
    pushPolarChart(polar);

    var valoreTotale = percent(data); // Trovo il valore totale con una funzione, per la %.
    console.log(valoreTotale);

    //Estrapolo da data i valori che mi servono per le miei 2 variabili vuote
    var dati = data; // ho i miei dati
    for (var i = 0; i < dati.length; i++) {
        var dato = dati[i]; //estrapolo i singoli dati
        var valore = parseInt(dato.amount); //Trovo i valori
        var venditore = dato.salesman; //Trovo i nomi dei venditori

        var mese = dato.date; // Trovo le date
        var thisMonth = moment(mese, 'DD/MM/YYYY').format("MMMM"); //Trovo solo i MESI dalle date, estrapolo da mese (DD/MM/YYYY), solo i nomi dei mesi .format('MMMM')

        //var thisNumberMonth = moment(mese, 'DD/MM/YYYY').format("M") % 3;// Trovo il mese numerato

        //Mesi e vendite
        meseSomma[thisMonth] += valore; //ogni volta sovrascrivo in ordine e sommo con += tutti i valori

        //Venditori e vendite
        if (venditeVenditore[venditore] === undefined) { // Se === a indefinito, allora....
            venditeVenditore[venditore] = 0; //il valore sarà pari a 0, quindi lo creo per poi fare in modo che si riempia dei valori
        }
        venditeVenditore[venditore] += valore;
        //console.log(meseSomma[thisMonth]) ---> Mi trova tutti i valori dei signoli soggetti
    }
        valoriFinali(meseSomma) //--------> Porto fuori la mia variabile per ciclare 'for in ' mesi e vendite <---------
        valoriFinaliVenditori(venditeVenditore, valoreTotale) // ------> Porto fuori la mia variabile per ciclare 'for in ' venditori e vendite <--------
};

// ---------> FUNZIONI EXTRA <----------
//Ciclo il mio valore totale per avere la %
function percent(totaleDati){
    var fatturato = 0; //Variabile vuota pari a 0, dove aggiungero il risulato e riporterò fuori con il return
    for (var i = 0; i < totaleDati.length; i++) {
        var datoSingolo = totaleDati[i];
        var valoreDato = datoSingolo.amount;
        fatturato += parseInt(valoreDato);
    }
    return fatturato;
}

//Ciclo per trovare i quarter
function quarterData(ciclo){
    var quarterMonth = {
        'q1':0,
        'q2':0,
        'q3':0,
        'q4':0
    }; //Grafico 3
    for (var i = 0; i < ciclo.length; i++) {
        var cicli = ciclo[i];
        var valoreDato = cicli.amount;
        var meseQ = cicli.date;
        var thisQuarterMonth = moment(meseQ, 'DD/MM/YYYY').format("M");
        if (thisQuarterMonth <= 3) {
            quarterMonth['q1'] += parseInt(valoreDato);
        } else if (thisQuarterMonth > 3 && thisQuarterMonth <= 6)  {
            quarterMonth['q2'] += parseInt(valoreDato);
        } else if (thisQuarterMonth > 6 && thisQuarterMonth <= 9)  {
            quarterMonth['q3'] += parseInt(valoreDato);
        } else if (thisQuarterMonth > 9 && thisQuarterMonth <= 12)  {
            quarterMonth['q4'] += parseInt(valoreDato);
        }
    }
    return quarterMonth;
}


//---------------> GRAFICO MESI E VENDITE <-----------------

//Funzione per trovare  i valori finali
function valoriFinali(meseSomma){
    var labelsChart = []; // Creazione variabile vuota per inserirci le mie date da richiamare poi nella chart
    var dataChart = []; // Creazione variabile vuota per inserirci i miei valori da richiamare poi nella chart

    for (var key in meseSomma) {
        labelsChart.push(key);
        dataChart.push(meseSomma[key]);
    }
    laMiaSomma(labelsChart, dataChart);
};

//Assegno i valori finali trovati, alla mia CHART per i valori mensili
function laMiaSomma(labels, data){
    var ctx = $('#grafico');
    var chart = new Chart(ctx, {

        type: 'line',

        data: {
            labels: labels, //riporto il mio valore del mese
            datasets: [{
                label: 'Database incassi annuali 2017',
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: data //riporto il mio valore dei valori
            }]
        },
    });
};


//---------------> GRAFICO VENDITORI E VENDITE <-----------------

//Funzione per trovare i valori dei signoli venditori:
function valoriFinaliVenditori(venditeVenditore, valoreTotale){
    var labelsVenditoreChart = [];
    var dataVenditoreChart = [];
    var backgroundColor = ['red', 'lightgreen', 'lightblue', 'yellow']

    for (var key in venditeVenditore) {
        labelsVenditoreChart.push(key);
        var percentualeVendite = ((venditeVenditore[key] / valoreTotale)* 100).toFixed(2); //Calcolo il valore in %
        dataVenditoreChart.push(percentualeVendite); //Pusho il valore in %
    }
    laMiaSommaVenditori(labelsVenditoreChart, dataVenditoreChart, backgroundColor);
};

//Assegno i valori finali trovati, alla mia CHART per i valori dei venditori
function laMiaSommaVenditori(labels2, data2, bkColor){
    var ctx = $('#grafico-torta');
    var chart = new Chart(ctx, {

        type: 'pie',
        data: {
            datasets: [{
                data: data2,
                backgroundColor: bkColor
            }],

            labels: labels2
        },
        options: {
            title: {
            display: true,
            text: 'Guadagni singoli venditori'
            },
        responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                }
            },
        }
    })
};


// --------> GRAFICO VENDITE IN QUARTER (MILESTONE 3)<--------

//Funzione per assegnare i valori dei singoli quarter
function graficoQuarter(variabileQuarti){
    var labelQuarter = [];
    var dataQuarter = [];

    for (var key in variabileQuarti) {
        labelQuarter.push(key);
        dataQuarter.push(variabileQuarti[key]);
    }
    stampaGraficoQuarter(labelQuarter, dataQuarter);
};

//Assegno i valori finali trovati, alla mia CHART per i valori dei quarter
function stampaGraficoQuarter(labelQ, dataQ){
    var ctx = $('#grafico-bar');
    var chart = new Chart(ctx, {

        type: 'bar',
        data: {
            datasets: [{
                data: dataQ,
                backgroundColor: ['lightblue', 'lightblue', 'lightblue', 'lightblue']
            }],

            labels: labelQ
        },
        options: {
            title: {
            display: true,
            text: 'Fatturato per quarter'
        }
    }
    })
};


//--------> GRAFIO POLAR CON VENDITE DEI VENDITORI <-------

//Trovo i miei dati tramite la variabile polarMix
function polarData(iMieiDati){
    var polarMix = {};
    for (var i = 0; i < iMieiDati.length; i++) {
        var singoloDato = iMieiDati[i];
        var venditoriPolar = singoloDato.salesman;
        var cifrePolar = singoloDato.amount;
        if (polarMix[venditoriPolar] === undefined) {
            polarMix[venditoriPolar] = 0;
        }
        polarMix[venditoriPolar] += parseInt(cifrePolar)
    }
    return polarMix;
}

//Trovo i valori da pushare nell'array per dargli in pasto al grafico che li leggerà
function pushPolarChart(polarValue){
    var labelPolar = [];
    var dataPolar =[];

    for (var key in polarValue) {
        labelPolar.push(key);
        dataPolar.push(polarValue[key]);
    }
    polarChartValue(labelPolar, dataPolar)
}

//Creo il mio grafico POLAR
function polarChartValue(labelP, dataP){
    var ctx = $('#grafico-polar');
    var chart = new Chart(ctx, {

        type: 'polarArea',
        data: {
            datasets: [{
                data: dataP,
                backgroundColor: ['red', 'blue', 'orange', 'pink']
            }],

            labels: labelP
        },
        options: {
            title: {
            display: true,
            text: 'Guadagni singoli venditori'
            },
        }
    })
};


//--------> MILESTONE 2 <-----------

//Confronto i miei venditori con il mio select, e poi gli assegno il valore da aggiungere
$('#press').click(function(){
    var selectedSeller = $(".seller-type").val();// Il valore (nome venditore) di selected seller
    notSelectedSeller(selectedSeller); //Controllo sul venditore scelto
    var value = $('#value').val(); //La cifra che inserisco
    //notValue(value); //Controllo sul valore inserito
    var date = $('#date').val();//La data che che scelgo e sotto la traformo
    wrongDate(date) // Controllo su data < o > 2017
    var dataForma = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'); //Trasformo data che è in YYYY-MM-DD, in DD/MM/YYYY così che sia leggibile dal sistema
    $('#value').val('');
    $('#date').val('2017-01-01');
    $(".seller-type").val('scegli');
    operazione(selectedSeller, value, dataForma);
});


//Ajax POST
function operazione(sceltaVenditore, value, date){
    $.ajax({
        url: baseUrl,
        method: 'POST',
        data:{"salesman": sceltaVenditore, "amount": value, "date": date},
        success: function(modify){
            var costruttore = costruttoreModify(modify);
        },
        error: function(){
            alert('errore')
        }
    });
};


function costruttoreModify(modify){
    $('#grafico').replaceWith('<canvas id="grafico"></canvas>');
    $('#grafico-torta').replaceWith('<canvas id="grafico-torta"></canvas>');
    $('#grafico-bar').replaceWith('<canvas id="grafico-bar"></canvas>');
    stampaGrafici();
};


//-------> CONTROLLI SUGLI INPUT <---------

//Se non si sceglie nessun venditore:
function notSelectedSeller(value){
    if (value == 'scegli') {
        alert('Scegli un venditore');
    }
    return value;
};

/*
//Se non si inserisce nessuna cifra:
function notValue(valore) {
    if (valore == "NaN") {
        alert('Inserisci una cifra');
    }
    return valore;
};
*/

//Data non disponile :
function wrongDate(date){
    var year = parseInt(moment(date, "YYYY-MM-DD").format('YYYY')); //Trovo l'anno
    if (year < 2017) {
        alert('Anno inserito non valido')
    } else if (year > 2017) {
        alert('Anno inserito non valido')
    }
    return year;
}
