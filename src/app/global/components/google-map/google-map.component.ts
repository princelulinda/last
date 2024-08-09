import { Component, OnInit } from '@angular/core';
import { MerchantService } from '../../../core/services';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { Coords2Model, CoordsModel } from '../google-map/map.model';

@Component({
  selector: 'app-google-map',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker],
  templateUrl: './google-map.component.html',
  styleUrl: './google-map.component.scss',
})
export class GoogleMapComponent implements OnInit {
  mapCenter = { lat: -3.3816576, lng: 29.360128 };
  mapZoom = 15;
  // coords!: CoordsModel[];
  coords!: CoordsModel[];

  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: '../../../../../assets/images/merchant-marker.svg',
      scaledSize: new google.maps.Size(26, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 41),
    },
  };

  constructor(private merchantService: MerchantService) {}

  ngOnInit(): void {
    // this.getLocation()
    this.getMerchantsLocation();

    this.merchantService.coords$.subscribe((coords: Coords2Model) => {
      if (coords) {
        this.mapCenter = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
      }
      // console.log('coords x', coords);
    });
  }

  // ngDoCheck() {
  //     console.log('wdwiiii', window.innerWidth);
  // }

  // markerClick(event: google.maps.MapMouseEvent, coord: any): void {
  //   // Handle marker click event
  //   console.log('Marker clicked:', coord);
  // }

  getMerchantsLocation() {
    this.merchantService.getMerchantsLocation().subscribe(data => {
      const response = data as {
        objects: { type: string; features: CoordsModel[] };
      };
      this.coords = response.objects.features;
    });
  }
}
