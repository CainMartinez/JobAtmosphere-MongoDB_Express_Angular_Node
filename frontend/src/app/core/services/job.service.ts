import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Job } from '../models/job.model';
import { environment } from '../../environments/evironment';

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

    //CREATE
    create_job(job: Job): Observable<Job[]> {
        return this.http.post<Job[]>(`${this.apiUrl}/jobs`, job);
    }

    //UPDATE ONE
    update_job(job: Job, slug: String): Observable<Job[]> {
        return this.http.put<Job[]>(`${this.apiUrl}/jobs/${slug}`, job);
    }

    //DELETE ONE
    delete_job(slug: any): Observable<Job[]> {
        return this.http.delete<Job[]>(`${this.apiUrl}/jobs/${slug}`);
    }

    //DELETE ALL
    delete_all_jobs(): Observable<Job[]> {
        return this.http.delete<Job[]>(`${this.apiUrl}/jobs`);
    }

    getJobsByCategory(slug: String): Observable<Job[]> {
        return this.http.get<Job[]>(`${this.apiUrl}/categories/${slug}`);
    }
    
    //SEARCH
    find_job_name(search: string): Observable<any> {
        return this.http.get<Job>(`${this.apiUrl}/jobs?name=${search}`).pipe(
            map((data) => {
            return data;
            })
        );
    }
}