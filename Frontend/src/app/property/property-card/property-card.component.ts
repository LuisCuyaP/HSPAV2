import { Component, Input, OnInit } from '@angular/core';
import { IProperty } from '../IProperty.interface';
import { IPropertyBase } from 'src/app/model/ipropertybase';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.css']
})
export class PropertyCardComponent{
@Input() property : IPropertyBase;
@Input() hideIcons : boolean = false;


}
