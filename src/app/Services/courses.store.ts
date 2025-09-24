import { LoadingService } from './../loading/loading.service';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { HttpClient } from '@angular/common/http';
import { MessagesService } from '../messages/messages.service';

@Injectable({
    providedIn: 'root'
})

export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();


    constructor(private readonly http:HttpClient, 
        private readonly loadingService:LoadingService,
        private readonly messageService: MessagesService) { 
            this.loadAllCourses();
    }

    private loadAllCourses() {
        console.log("loadAllCourses courses store");
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
        .pipe(
            map(res => {
                console.log("res['payload']");
                return res['payload'];
            }),
            catchError(error => {
                const message = "Could not load courses";
                this.messageService.showErrors(message);
                console.log(message, error);
                return throwError(error);
            }),
            tap(courses => {
                console.log("loadAllCourses data arraived", courses);
                this.subject.next(courses);
            })
        )

        this.loadingService.showLoaderUntilCompleted(loadCourses$)
        .subscribe();
        console.log("subscribe done");
    }

    filterByCategory(category: string): Observable<Course[]> {
        console.log("filterByCategory: ", category);

        return this.courses$.pipe(
            map(courses => {
                console.log("courses", courses)
                return courses.filter(course => course.category == category)
                .sort(sortCoursesBySeqNo)
            }
            )
        );
    }
}