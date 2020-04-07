//Chiamata Ajax per richiamre i valori dell'API

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

$.ajax({

        url: 'http://157.230.17.132:4014/sales',
        method: 'GET',
        success: function(data){
            var meseSomma = { //Prendo i valori in ordine e ci aggiungo i risultati corrispondenti
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
            };
            var venditeVenditore = {  } //Valore vuoto per i venditori

            var dati = data; // ho i miei dati
            for (var i = 0; i < dati.length; i++) {
                var dato = dati[i] //estrapolo i singoli dati
                // console.log(dato.id); //Non mi serve in questo caso
                // console.log(dato.salesman); //Non mi serve in questo caso
                // console.log(dato.amount); //Mi interessa l'ammontare delle somme
                // console.log(dato.date); //Mi interessa la data, e troverò il mese
                var venditore = dato.salesman;
                var mese = dato.date; // Mi creo la variabile in cui estrapolo la data
                var thisMonth = moment(mese, 'DD/MM/YYYY').format("MMMM"); //Trovo il mese che mi servirà per la somma
                //console.log(thisMonth);
                if (meseSomma[thisMonth] === undefined) { // MESI E VENDITE
                    meseSomma[thisMonth] = 0;
                }
                meseSomma[thisMonth] += dato.amount;
                if (venditeVenditore[venditore] === undefined) { // VENDITORI E VENDITE
                    venditeVenditore[venditore] = 0;
                }
                venditeVenditore[venditore] += dato.amount;
                //console.log(meseSomma[thisMonth]) ---> Mi trova tutti i valori dei signoli soggetti
            }
                valoriFinali(meseSomma) //mesi e vendtiori
                valoriFinaliVenditori(venditeVenditore) //venditori e fatturato
        },
        error: function(){
            alert('errore')
        }
    });

//---------------> MESI E VENDITE <-----------------


//Funzione per trovare  i valori finali
function valoriFinali(meseSomma){
    var labelsChart = []; // Creazione variabile vuota per inserirci le mie date da richiamare poi nella chart
    var dataChart = []; // Creazione variabile vuota per inserirci i miei valori da richiamare poi nella chart

    for (var key in meseSomma) {
        labelsChart.push(key);
        dataChart.push(meseSomma[key])
    }
    laMiaSomma(labelsChart, dataChart)
};


//Assegno i valori finali trovati, alla mia CHART per i valori mensili
function laMiaSomma(labels, data){
    var ctx = $('#grafico');
    var chart = new Chart(ctx, {

        type: 'line',

        data: {
            labels: labels, //riporto il mio valore del mese
            datasets: [{
                label: 'Database incassi annuali 2018',
                backgroundColor: 'orange',
                borderColor: 'orange',
                data: data //riporto il mio valore dei valori
            }]
        },
    });
};


//---------------> VENDITORI E VENDITE <-----------------


//Funzione per trovare i valori dei signoli venditori:
function valoriFinaliVenditori(venditeVenditore){
    var labelsVenditoreChart = [];
    var dataVenditoreChart = [];

    for (var key in venditeVenditore) {
        labelsVenditoreChart.push(key);
        dataVenditoreChart.push(Math.round(venditeVenditore[key] * 10 / 118.940)); //Circa un %
    }
    laMiaSommaVenditori(labelsVenditoreChart, dataVenditoreChart)
};

//Assegno i valori finali trovati, alla mia CHART per i valori dei venditori
function laMiaSommaVenditori(labels2, data2){
    var ctx = $('#grafico-torta');
    var chart = new Chart(ctx, {

        type: 'pie',
        data: {
            datasets: [{
                data: data2,
                backgroundColor: ['red', 'green', 'blue', 'yellow']
            }],

            labels: labels2
        },
        options: {
            title: {
            display: true,
            text: 'Guadagni di ogni singolo venditore (2017)'
      }
    }
    })
};
