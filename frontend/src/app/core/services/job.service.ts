import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';
import { environment } from '../../environments/environment';
import { Filters } from '../models/filters.model';


@Injectable({
    providedIn: 'root'
})
export class JobService {
    
    private readonly apiUrl = environment.api_url;

    constructor(private http: HttpClient) { }

    //GET ALL
    get_jobs(): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
    }

    //GET ONE
    get_job(slug: String): Observable<Job> {
        return this.http.get<Job>(`${this.apiUrl}/jobs/${slug}`);
    }
    get_jobs_filter(filters : Filters): Observable<Job[]> {
        let params = {};
        params = filters;
        return this.http.get<Job[]>(`${this.apiUrl}/jobs` , {params});
    }
    //CREATE
    // create_job(job: Job): Observable<Job[]> {
    //     return this.http.post<Job[]>(`${this.apiUrl}/jobs`, job);
    // }

    //UPDATE ONE
    // update_job(job: Job, slug: String): Observable<Job[]> {
    //     return this.http.put<Job[]>(`${this.apiUrl}/jobs/${slug}`, job);
    // }

    //DELETE ONE
    // delete_job(slug: any): Observable<Job[]> {
    //     return this.http.delete<Job[]>(`${this.apiUrl}/jobs/${slug}`);
    // }

    //DELETE ALL
    // delete_all_jobs(): Observable<Job[]> {
    //     return this.http.delete<Job[]>(`${this.apiUrl}/jobs`);
    // }

    getJobsByCategory(slug: String): Observable<Job[]> {
        return this.http.get<any>(`${this.apiUrl}/categories/${slug}/jobs`);
    }
    //SEARCH
    find_job_name(search: string): Observable<any> {
        return this.http.get<Job>(`${this.apiUrl}/jobs?name=${search}`).pipe(
            map((data) => {
                return data;
            })
        );
    }

    //FAVORITE
    favorite(id: String): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/favorite`, {})
    }

    //UNFAVORITE
    unfavorite(id: String): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}/favorite`)
    }
}