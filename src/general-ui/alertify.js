import alertify from 'alertifyjs';
import './alertify.css';

export default ()=>{
  alertify.set('notifier','position', 'top-right');
  alertify.set('notifier','delay', 9);
};