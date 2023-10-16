import { Component, ViewChild } from '@angular/core';
import SwiperCore, {SwiperOptions} from 'swiper';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

interface productSlide  {
  id: number,
  imagen: string,
}

interface product {
  id: number,
  price: number,
  name: string,
  stock: number,
  description: string,
  state: boolean,
  imagen: string,
  codigo: string
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Ventas por mes"
      },
      xaxis: {
        categories: ["Jan", "Feb",  "Mar",  "Apr",  "May",  "Jun",  "Jul",  "Aug", "Sep"]
      }
    };
  }

  onSwiper(swiper: any) {
    console.log(swiper);
  }





  masVendidos:productSlide[] = [
    {
      id: 1,
      imagen:'https://img.freepik.com/vector-gratis/fondo-producto-cosmetico_52683-205.jpg?size=626&ext=jpg&ga=GA1.1.1012331098.1695747427&semt=sph'
    },
    {
      id: 2,
      imagen:'https://img.freepik.com/psd-gratis/venta-zapatos-publicacion-redes-sociales-o-diseno-plantilla-banner-cuadrado_505751-3735.jpg?size=626&ext=jpg&ga=GA1.1.1012331098.1695747427&semt=sph'
    },
    {
      id: 3,
      imagen:'https://img.freepik.com/psd-gratis/plantilla-banner-redes-sociales-super-venta-viernes-negro_106176-1477.jpg?size=626&ext=jpg&ga=GA1.1.1012331098.1695747427&semt=sph'
    }
  ]


  productos: product[] = [
    {
      codigo: 'qwer',
      description: 'descricion asasdasd a das d asd',
      id: 1,
      imagen: 'https://img.freepik.com/psd-gratis/plantilla-banner-redes-sociales-super-venta-viernes-negro_106176-1477.jpg?size=626&ext=jpg&ga=GA1.1.1012331098.1695747427&semt=sph',
      name: 'Control de Nintendo Switch',
      price: 500,
      state: true,
      stock: 2
    },
    {
      codigo: 'fsdfsdf',
      description: 'descricion asasdasd a das d asd',
      id: 2,
      imagen: 'https://img.freepik.com/psd-gratis/diseno-maqueta-smartphone-pantalla-completa_53876-65968.jpg?w=740&t=st=1696527844~exp=1696528444~hmac=8522837c28244c08ec5a8bb2f62e6c6748c21b1ac1b684205830629cfffb0ecc',
      name: 'Celular xiaomi',
      price: 6300,
      state: true,
      stock: 5
    },
    {
      codigo: 'sfsdfsd3',
      description: 'descricion asasdasd a das d asd',
      id: 3,
      imagen: 'https://img.freepik.com/psd-premium/maqueta-telefono-inteligente-plano-cafe-planta_23-2148657342.jpg?w=1060',
      name: 'Bocinas Bluethot',
      price: 100,
      state: true,
      stock: 0
    },
    {
      codigo: 'sfdfsd',
      description: 'descricion asasdasd a das d asd',
      id: 4,
      imagen: 'https://img.freepik.com/psd-gratis/plantilla-banner-redes-sociales-super-venta-viernes-negro_106176-1477.jpg?size=626&ext=jpg&ga=GA1.1.1012331098.1695747427&semt=sph',
      name: 'Audifonos Sony',
      price: 750,
      state: true,
      stock: 10
    }

  ]

}
