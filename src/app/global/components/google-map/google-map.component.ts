import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() lat = -3.3816576;
  @Input() lng = 29.3568512;
  @Input() isLoading = false;
  @Input() detailed = false;
  @Output() coordsD =
    new EventEmitter<{ lat: number; lng: number }>();

  zoom = 15;
  markerOptionsD: google.maps.MarkerOptions = {
    draggable: true,
  };
  markerPosition: google.maps.LatLngLiteral = { lat: this.lat, lng: this.lng };
  showButton = false;
  noLocationMessage: boolean | undefined;

  mapCenter = { lat: -3.3816576, lng: 29.360128 };
  mapZoom = 15;
  coords!: CoordsModel[];

  markerOptions: google.maps.MarkerOptions = {
    icon: {
      url: '../../../../../assets/images/merchant-marker.svg',
      scaledSize: new google.maps.Size(26, 50),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(12, 41),
    },
  };

  constructor(private merchantService: MerchantService) {
    this.getLocation();
  }

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
  getMerchantsLocation() {
    this.merchantService.getMerchantsLocation().subscribe(data => {
      const response = data as {
        objects: { type: string; features: CoordsModel[] };
      };
      this.coords = response.objects.features;
    });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.lat = event.latLng.lat();
      this.lng = event.latLng.lng();
      this.markerPosition = { lat: this.lat, lng: this.lng };
      this.coordsD.emit({ lat: this.lat, lng: this.lng });
      this.showButton = true;
    }
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          if (position) {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.markerPosition = { lat: this.lat, lng: this.lng };
          }
        },
        error => {
          console.error(error);
          this.noLocationMessage = true;
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  setLocation() {
    const coordinates = { lat: this.lat, lng: this.lng };
    this.coordsD.emit(coordinates);
    console.log('Set location:', coordinates);
  }
}
