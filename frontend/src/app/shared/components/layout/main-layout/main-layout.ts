import {Component} from '@angular/core';
import {Sidebar} from '../sidebar/sidebar';
import {RouterOutlet} from '@angular/router';
import {Header} from '../header/header';
import {NotificationContainer} from '@shared/components/ui/notification-container/notification-container';
import {GlobalLoading} from '@shared/components/ui/global-loading/global-loading';

@Component({
  selector: 'app-main-layout',
  imports: [
    Sidebar,
    RouterOutlet,
    Header,
    NotificationContainer,
    GlobalLoading
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
