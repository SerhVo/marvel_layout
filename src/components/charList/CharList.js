import "./charList.scss";
// import abyss from "../../resources/img/abyss.jpg";
import { Component } from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
    selectedCharId: null, // Хранит ID выбранного элемента
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({ newItemLoading: true });
  };

  onCharListLoaded = (newCharList) => {
    const isCharEnded = newCharList.length < 9; // Проверяем, если меньше 9 объектов
    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: isCharEnded, // Обновляем состояние
    }));
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  onCharSelected = (id) => {
    this.setState({ selectedCharId: id }); // Устанавливаем выбранный ID
    this.props.onCharSelected(id); // Вызываем переданный из props обработчик
  };

  renderItems(arr = []) {
    if (!Array.isArray(arr)) return null;

    const { selectedCharId } = this.state; // Получаем ID выбранного элемента

    const items = arr.map((item) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      // Добавляем класс "char_selected", если текущий элемент выбран
      const itemClass =
        item.id === selectedCharId
          ? "char__item char__item_selected"
          : "char__item";

      return (
        <li
          className={itemClass}
          key={item.id}
          onClick={() => this.onCharSelected(item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });

    return <ul className="char__grid">{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } =
      this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={charEnded ? { display: "none" } : {}}
          onClick={() => this.onRequest(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;


