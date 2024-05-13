import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('paragraph1', {static: false}) paragraph1!: ElementRef<HTMLElement>;
  @ViewChild('paragraph2', {static: false}) paragraph2!: ElementRef<HTMLElement>;
  @ViewChild('paragraph3', {static: false}) paragraph3!: ElementRef<HTMLElement>;
  @ViewChild('paragraph4', {static: false}) paragraph4!: ElementRef<HTMLElement>;

  constructor() {}

  ngAfterViewInit() {
    this.observeParagraph(this.paragraph1.nativeElement, 1000); // Prikazuje se prvi pasus nakon 1 sekunde
    this.observeParagraph(this.paragraph2.nativeElement, 2000); // Prikazuje se drugi pasus nakon 2 sekunde
    this.observeParagraph(this.paragraph3.nativeElement, 3000); // Prikazuje se treći pasus nakon 3 sekunde
    this.observeParagraph(this.paragraph4.nativeElement, 4000); // Prikazuje se četvrti pasus nakon 4 sekunde
  }

  observeParagraph(paragraph: HTMLElement, delay: number) {
    setTimeout(() => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.fadeIn(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(paragraph);
    }, delay);
  }

  fadeIn(element: HTMLElement) {
    let opacity = 0;
    const interval = setInterval(() => {
      if (opacity < 1) {
        opacity += 0.1;
        element.style.opacity = opacity.toString();
      } else {
        clearInterval(interval);
      }
    }, 100); // Interval za postepeno pojavljivanje teksta
  }
}













