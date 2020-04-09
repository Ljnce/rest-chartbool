// Gennaio: tot amount
// Febbraio:  tot amount
// Marzo:  tot amount
// Aprile:  tot amount
// Maggio:  tot amount
// Giugno:  tot amount
// Luglio:  tot amount
// Agosto:  tot amount
// Settembre:  tot amount
// Ottobre:  tot amount
// Novembre:  tot amount
// Dicembre:  tot amount

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
            alert('errore')
        }
    });
};

//-------> ESTRAPOLO I CONTENUTI CHE MI SERVONO DALL'AJAX <----------
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

    //Estrapolo da data i valori che mi servono per le miei 2 variabili vuote
    var dati = data; // ho i miei dati
    for (var i = 0; i < dati.length; i++) {
        var dato = dati[i]; //estrapolo i singoli dati
        var valore = parseInt(dato.amount); //Trovo i valori
        var valoreTotale = percent(dati); // Trovo il valore totale con una funzione, per la %.
        console.log(valoreTotale);
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

//---------------> MESI E VENDITE <-----------------


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


//---------------> VENDITORI E VENDITE <-----------------


//Funzione per trovare i valori dei signoli venditori:
function valoriFinaliVenditori(venditeVenditore, valoreTotale){
    var labelsVenditoreChart = [];
    var dataVenditoreChart = [];

    for (var key in venditeVenditore) {
        labelsVenditoreChart.push(key);
        var percentualeVendite = ((venditeVenditore[key] / valoreTotale)* 100).toFixed(2); //Calcolo il valore in %
        dataVenditoreChart.push(percentualeVendite); //Pusho il valore in %
    }
    laMiaSommaVenditori(labelsVenditoreChart, dataVenditoreChart);
};

//Assegno i valori finali trovati, alla mia CHART per i valori dei venditori
function laMiaSommaVenditori(labels2, data2){
    var ctx = $('#grafico-torta');
    var chart = new Chart(ctx, {

        type: 'pie',
        data: {
            datasets: [{
                data: data2,
                backgroundColor: ['red', 'lightgreen', 'lightblue', 'yellow']
            }],

            labels: labels2
        },
        options: {
            title: {
            display: true,
            text: 'Guadagni di ogni singolo venditore (2017)'
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


//--------> MILESTONE 2 <-----------

//Confronto i miei venditori con il mio select, e poi gli assegno il valore da aggiungere

$('#press').click(function(){
    var selectedSeller = $(".seller-type").val();// Il valore (nome venditore) di selected seller
    notSelectedSeller(selectedSeller); //Controllo sul venditore scelto
    var value = $('#value').val(); //La cifra che inserisco
    //notValue(value); //Controllo sul valore inserito
    var date = $('#date').val();//La data che che scelgo e sotto la traformo
    var dataForma = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY'); //Trasformo data che è in YYYY-MM-DD, in DD/MM/YYYY così che sia leggibile dal sistema
    $('#value').val('');
    $('#date').val('');
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
    $('.container-primo').append('<canvas id="grafico"></canvas>');
    $('.container-torta').append('<canvas id="grafico-torta"></canvas>');
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
    if (valore == "") {
        alert('Inserisci una cifra');
    }
    return valore;
};

//Data non disponile :
function notDate(data){
    if (data == "01/01/2017") {
        alert('oooo')
    }
    return data;
}
*/
