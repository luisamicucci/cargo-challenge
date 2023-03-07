import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Todo } from '../shared/todo.model';
import { TodoService } from '../shared/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  totalTime: string;
  isPlaying: boolean = false;

  constructor(private todoService: TodoService) {
    this.totalTime = "00:00:00";
  }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos = todos.sort((a: any, b: any) => { return a.isCompleted - b.isCompleted });

      this.timeCalculation();
    });
  }

  onClick(titleInput: HTMLInputElement) {
    if (titleInput.value) {

      const todo: Todo = {
        title: titleInput.value,
        isCompleted: false,
        cycleTime: 0,
        timeConsumed: 0
      };

      this.todoService.addTodo(todo);
      titleInput.value = "";
    }
  }

  onStatusChange(todoItem: Todo) {
    todoItem.isCompleted = !todoItem.isCompleted;
    this.todoService.updateTodo(todoItem.id ? todoItem.id : "default", todoItem);
  }

  onDelete(id: string) { this.todoService.deleteTodo(id); }

  timeCalculation() {
    const totalMilliseconds = this.todos.reduce((a, b) => {
      let time: number = 0;

      if (b.cycleTime > 0) {
        time = environment.timerConfig.time * b.cycleTime;
      }

      return a + b.timeConsumed + time;
    }, 0);

    this.totalTime = this.formatTime(totalMilliseconds);
  }

  formatTime(milliseconds: number): string {
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds %= 3600000;
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds %= 60000;
    const seconds = Math.floor(milliseconds / 1000);

    const time = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    return time;
  }

  onPlay(isPlaying: boolean) {
    this.isPlaying = isPlaying;
  }
}
