<script>
import { Pie } from "vue-chartjs";

export default {
  name: "PieChart",
  props: {
    initialData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    name: function() {
      return this.initialData.map(i => i.name);
    },
    count: function() {
      return this.initialData.map(i => i.count);
    }
  },
  extends: Pie,
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient4 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient5 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.9)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.45)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(255, 150, 0, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(255, 150, 0, 0.9)");
    this.gradient2.addColorStop(1, "rgba(255, 150, 0, 0)");

    this.gradient3.addColorStop(0, "rgba(160, 255,100, 0.9)");
    this.gradient3.addColorStop(0.5, "rgba(160, 255, 100, 0.9)");
    this.gradient3.addColorStop(1, "rgba(160, 255, 100, 0)");

    this.gradient4.addColorStop(0, "rgba(30, 135, 200, 0.9)");
    this.gradient4.addColorStop(0.5, "rgba(30, 135, 200, 0.9)");
    this.gradient4.addColorStop(1, "rgba(30, 135, 200, 0)");

    this.gradient5.addColorStop(0, "rgba(120, 45, 170, 0.9)");
    this.gradient5.addColorStop(0.5, "rgba(120, 45, 170, 0.45)");
    this.gradient5.addColorStop(1, "rgba(120, 45, 170, 0)");

    this.renderChart(
      {
        labels: [...this.name],
        datasets: [
          {
            backgroundColor: [
              this.gradient,
              this.gradient2,
              this.gradient3,
              this.gradient4,
              this.gradient5
            ],
            data: [...this.count]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>