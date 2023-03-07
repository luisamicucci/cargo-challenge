import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { environment } from 'src/environments/environment';
import { Todo } from '../todo.model';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  config: CountdownConfig = { leftTime: environment.timerConfig.default, notify: 0, demand: true, format: 'mm:ss' };

  @Input() todo!: Todo;
  @Output() isPlayingEmitter = new EventEmitter<boolean>();
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;
  isPlaying: boolean = false;

  constructor(private todoService: TodoService) {
  }

  ngOnInit(): void {
    if (this.todo.id !== undefined) {
      let value = +localStorage.getItem(this.todo.id)!! ?? environment.timerConfig.default;
      if (value <= 0) value = environment.timerConfig.default;
      this.config = { ...this.config, leftTime: value };
    }
  }

  onClick() {
    this.isPlaying = !this.isPlaying;

    this.isPlayingEmitter.emit(this.isPlaying);

    if (this.isPlaying) {
      this.countdown.begin();
    } else {
      this.countdown.pause();
    }
  }

  handleEvent(ev: CountdownEvent) {
    if (ev.action === 'notify' && this.todo.id !== undefined) {
      localStorage.setItem(this.todo.id, `${ev.left / 1000}`);
    }

    if (ev.action === 'pause' && this.todo.id !== undefined) {
      this.todo.timeConsumed = (environment.timerConfig.time - ev.left);
      this.todoService.updateTodo(this.todo.id, this.todo);
    }

    if (ev.left == 0 && ev.action === 'done') {
      if (this.todo.cycleTime !== undefined && this.todo.id !== undefined) {
        this.todo.cycleTime = this.todo.cycleTime + 1;
        this.todoService.updateTodo(this.todo.id, this.todo);
      }
    }
  }

}
