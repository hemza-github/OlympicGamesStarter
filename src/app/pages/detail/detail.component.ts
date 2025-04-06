import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Olympic } from '../../core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  countryId!: number;
  olympic!: Olympic | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.countryId = Number(params.get('id'));

      this.olympicService.getOlympicsData().subscribe((data) => {
        this.olympic = data.find((olympic) => olympic.id === this.countryId);

        if (!this.olympic) {
          this.router.navigate(['/not-found']);
        }
      });
    });
  }
}
