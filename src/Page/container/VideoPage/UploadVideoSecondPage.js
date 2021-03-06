import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import styled from "styled-components"; /*npm i styled-components */
import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Form,
  message,
  Input,
} from "antd"; /*antd다운 필요  npm i antd*/

import Header from "../../component/Header.js";
import Navi from "../../component/Navi.js";

import "./UploadVideoSecondPage.css";
import Axios from "axios";

//태그 디자인
const TagBoxBlock = styled.div`
  margin-top: 0;
`;
const TagForm = styled.form`
  margin-top: 0;
`;
const TagListBlock = styled.div`
  display: flex;
  width: 500px;
  margin-top: 0.5rem;
  overflow: auto;
`;
const Tag = styled.div`
  margin: 5px;
  border: 1px solid gray;
  border-radius: 20px;
  padding: 5px;
  background: #f0f0f0;
  color: black;
  cursor: pointer;
`;

// React.memo를 사용하여 tag 값이 바뀔 때만 리렌더링되도록 처리
const TagItem = React.memo(({ tag, onRemove }) => (
  <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>
));

// React.memo를 사용하여 tags 값이 바뀔 때만 리렌더링되도록 처리
const TagList = React.memo(({ tags, onRemove }) => (
  <TagListBlock>
    {tags.map((tag) => (
      <TagItem key={tag} tag={tag} onRemove={onRemove} />
    ))}
  </TagListBlock>
));

const { Title } = Typography;

function UploadVideoSecondPage() {
  //정보나타내주기 위해 local에서 정보 get
  var video_thumbnail = localStorage.getItem("thumbnail");
  var video_category = localStorage.getItem("inbucket");
  var video_title = localStorage.getItem("pvideotitle");
  var video_userid = localStorage.getItem("userid");
  var keyword = localStorage.getItem("keyword");

  if (video_category == "en-us") {
    video_category = "영어영상";
  } else if (video_category == "ko-kr") {
    video_category = "한국영상";
  }

  // 태그 배열형태로 저장
  const tag_textrank = keyword.split("/");

  //태그관련
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState(tag_textrank);
  const insertTag = useCallback(
    (tag) => {
      if (!tag) return;
      if (localTags.includes(tag)) return;
      setLocalTags([...localTags, tag]);
    },
    [localTags]
  );

  console.log(localTags);

  const onRemove = useCallback(
    (tag) => {
      setLocalTags(localTags.filter((t) => t !== tag));
    },
    [localTags]
  );
  const onChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);
  const onSubmittag = useCallback(
    (e) => {
      e.preventDefault();
      insertTag(input.trim());
      setInput("");
    },
    [input, insertTag]
  );

  /*submit버튼 누르면 페이지 넘어감  */
  const onSubmit = (e) => {
    e.preventDefault();
    var keyword_new = localTags.join("/");
    console.log("localTags join 결과확인");
    console.log(keyword_new);
    console.log(video_userid);
    console.log(video_title);

    let body = {
      pvideotitle: video_title,
      uploader: video_userid,
      keyword: keyword_new,
    };

    axios
      .post("http://wordballoon.net:5050/api/upload/submit", body)
      .then((response) => {
        console.log("업로드 성공?");
        console.log(response);
        window.location.pathname = "/UploadVideoThird";
      });
  };

  return (
    <div>
      <Header />
      <Navi />
      <div class="UploadVideoSecondPage">
        <Title level={2} id="uploadpage2_title">
          {" "}
          Upload Video
        </Title>
        <div id="video_thumbnail_info">
          <img
            src={video_thumbnail}
            width="500px"
            height="300px"
            alt="thumbnail"
          />
        </div>
        <table id="video_info">
          <tr>
            <td id="video_table_h">제목</td>
            <td id="video_table_b">{video_title}</td>
          </tr>
          <tr>
            <td id="video_table_h">카테고리</td>
            <td id="video_table_b">{video_category}</td>
          </tr>
          <tr>
            <td id="video_table_h">게시자</td>
            <td id="video_table_b">{video_userid}</td>
          </tr>
        </table>

        <Form onSubmit={onSubmit}>
          <TagBoxBlock width="500px">
            <label id="tag_label">
              태그 <span id="tag_warning"> (누르면 삭제됩니다)</span>
            </label>
            <TagForm id="tag_upload" onSubmit={onSubmittag}>
              <input
                id="tag_input"
                placeholder="태그를 입력하세요"
                value={input}
                onChange={onChange}
              />
              <button id="tag_add_btn" type="submit">
                추가
              </button>
            </TagForm>
            <TagList
              width="500px"
              id="tag_list"
              tags={localTags}
              onRemove={onRemove}
            ></TagList>
          </TagBoxBlock>

          {/*버튼*/}
          <br />
          <Link to="/UploadVideoThird">
            <Button
              id="uploadpage2_submit_btn"
              type="primary"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Link>
        </Form>
      </div>
    </div>
  );
}
export default UploadVideoSecondPage;
