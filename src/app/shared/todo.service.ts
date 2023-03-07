import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Todo } from './todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private dbPath = '/todo';
  todoRef: AngularFireList<Todo>;

  constructor(private db: AngularFireDatabase) {
    this.todoRef = db.list(this.dbPath);
  }

  getTodos(): any {
    return this.todoRef.snapshotChanges().pipe(
      map(changes => changes.map(c => ({
        id: c.payload.key,
        ...c.payload.val() as Todo
      })))
    );
  }

  addTodo(todo: Todo): void {
    this.todoRef.push(todo);
  }

  updateTodo(key: string, value: any): Promise<void> {
    return this.todoRef.update(key, value);
  }

  deleteTodo(key: string): Promise<void> {
    return this.todoRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.todoRef.remove();
  }
}